
const SerialPort = require('serialport');
const Readline = require('parser-readline');
const express = require('express');
const path = require('path');
const Mongoose = require('mongoose');
const port = 8000;
const App = express();
const index_html_path = path.join(__dirname, 'webapp/flower/dist','index.html');
const Flower = require('./flower');
const FlowerHandler = require("./flower_handler");
const MeasurementEnum = { TEMP:'TEMP', HUMIDITY: 'HUMIDITY' };
const btoa = function(str){ return Buffer.from(str).toString('base64'); } //BASE64 helper function
Object.freeze(MeasurementEnum);
const portName = '/dev/tty.usbserial-FTVQRWKX';
const RadioState = { INITIAL: '1', REQUEST: '2', RECIEVING: '3' };
var _CONN_STATE_ = RadioState.INITIAL; //1 - mac pause & got num, 2-radio rx and got ok, 3 is good
// const MockBinding = SerialPort.Binding;
// MockBinding.createPort( portName, { echo: true, record: true });
const Port = new SerialPort( portName , {baudRate: 57600 }, (err) => {
    if(err){ 
        console.error(`Failed to connect to serial port ${portName}`); 
    }else{
        console.info("Port open ...");
        initialPortTasks();
    }
});
const Parser = Port.pipe(new Readline({ delimiter: '\r\n' }))
Port.on('error', function(err) {
    console.log('Error: ', err.message);
})
// Port.on('open', function() {
//     console.info("Port open ...");
//     // initialPortTasks();
// });
Parser.on("data", (data) => dataHandler(data));
// Port.on("readable", () => {
//     const data = Port.read()
    
//     dataHandler(data)
// })

const macPause = Buffer.from("mac pause\r\n");
const radioRX = Buffer.from("radio rx 0\r\n");
initialPortTasks = () => {
    Port.write( macPause, 'ascii', (err,bytesWritten) => {
        if(err){ console.error(err.message); }
        console.info(`Executing pause command on mac ....`);
        _CONN_STATE_ = RadioState.INITIAL;

        // Port.write(radioRX, (err,bytesWritten) => {
        //     if(err){ console.err(err); }                
        //     console.info("Requesting for data ....");
        //     console.info(Port.read())
        // });
    });
}

/**
 * Setup database connection
 */
Mongoose.connect('mongodb://localhost/flower');
const Database = Mongoose.connection;
Database.on('error', console.error.bind(console, "***Connection error:"));
Database.on('open', () => {
    console.info("Connection established to database");
    // var flower = generateFakeData();
    // flower.save()
    // console.info(flower);
});

App.use(express.static(path.join(__dirname,'webapp/flower/dist/')))

App.all("*", function (req, res, next) { //Enable Cross-Origin Requests
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return next();
});
App.get('/', (req,res) => res.sendFile(index_html_path));
App.get('/hello', (req,res) => res.json({"hello":"world"}));

/**
 * Sends all flowers
 * - [x] TODO: Add code to send a specific flower based on `req`
 */
App.get('/flower/:id?', (req,res) => {
    // Flower.remove({});
    const flower_id = req.params["id"];
    var query;
    if (flower_id !== undefined){
        query = Flower.find({ "_id": flower_id });
    }else{
        query = Flower.find({});
    }
    query.exec((err,flowers) => {
        if(err){ 
            res.status(300);
            res.send(err); 
        }else{
            res.json(flowers);
        }
    })
})
App.get('/overview', (req,res) => {
    FlowerHandler.overview()
                .then((results) => res.send(results), (err) => res.status(300).send(err))
})


function generateFakeData(){
    console.info("Generating fake flower data ...");
    types = Object.keys(MeasurementEnum); 
    rand_type = types[types.length * Math.random() << 0];

    var flower = new Flower({ 
        name: 'SunFlower_' + btoa(Math.random().toString()).substr(0,5).toUpperCase(),
        measurement: [
            {
                type: MeasurementEnum.TEMP,
                timestamp: new Date,
                value: Math.random() * 80
            },{
                type: MeasurementEnum.TEMP,
                timestamp: new Date(Math.random() * 10),
                value: Math.random() * 85
            },{
                type: MeasurementEnum.HUMIDITY,
                timestamp: new Date,
                value: Math.random() * 50
            },{
                type: MeasurementEnum.HUMIDITY,
                timestamp: new Date,
                value: Math.random() * 50
            }
        ]
    });
    return flower;
}


App.listen(port, () => console.log(`SunFlower Server listening on ${port}`));


dataHandler = (data) => {
    console.info(data);    
    data = data.replace("radio_rx  ","");
    var packet = new Buffer(data,'hex');
    console.info(`Recieved buffer : ${packet}`);

    if(_CONN_STATE_ == RadioState.INITIAL){
        _CONN_STATE_ = RadioState.REQUEST
    }else if( _CONN_STATE_ == RadioState.REQUEST ){
        _CONN_STATE_ = RadioState.RECIEVING
        console.info("Now waiting for data ...\n\n\n")
        return; //radio rx 0 was sent
    }else if( _CONN_STATE_ == RadioState.RECIEVING ){
        console.info("Recieving state ....")
        const id_buf = packet.slice(0,8);
        const type_buff = packet.slice(8,9);
        if( type_buff.readUInt8(0) == 1 ){ // 1 indicates measurement data being sent
            console.info("Measurement data recieved")
            const flower = {};
            flower['name'] = id_buf.toString("hex");
            flower['measurement'] = [];
            const length_buffer = packet.slice(9,10);
            var num_bytes_read = 0; //length_buffer.readUInt8(0);
            
            var offset = 10;
            while(num_bytes_read < length_buffer.readUInt8(0)){ //start reading measurement values
                const datatype_buffer = packet.readUInt8(offset); //read the unit type
                num_bytes_read += 1; offset += 1;
                measurement = {}

                if( datatype_buffer == 1 ){ //Relative temperature DegC / 100
                    measurement['type'] = 'TEMP'
                    //read in timestamp value which is 4 bytes
                    const timestamp_buffer = packet.slice(offset, offset + 4);
                    num_bytes_read += 4; offset += 4;
                    measurement['timestamp'] = new Date(timestamp_buffer.readInt32LE(0) * 1000);
                    // Temperature data is 2 bytes and is read as int16 (signed int)
                    const value_buffer = packet.slice(offset, offset + 2);                
                    measurement['value'] = value_buffer.readInt16LE(0) / 100;
                    num_bytes_read += 2; offset += 2;
                }else if( datatype_buffer == 2 ){ // Relative humidity - data / 100
                    measurement['type'] = 'HUMIDITY';
                    //read in timestamp value which is 4 bytes
                    const timestamp_buffer = packet.slice(offset, offset + 4);
                    num_bytes_read += 4; offset += 4;
                    measurement['timestamp'] = new Date(timestamp_buffer.readInt32LE(0) * 1000);
                    // Humidity data is 2 bytes and is read as UInt16
                    const value_buffer = packet.slice(offset, offset + 2);
                    measurement['value'] = value_buffer.readUInt16LE(0) / 100;
                }else if( datatype_buffer == 3 ){ // Abs light - no units 
                    measurement['type'] = 'LIGHT'
                    //read in timestamp value which is 4 bytes
                    const timestamp_buffer = packet.slice(offset, offset + 4);
                    num_bytes_read += 4; offset += 4;
                    measurement['timestamp'] = new Date(timestamp_buffer.readInt32LE(0) * 1000);
                    //Light data is 1 byte and is read as UInt8
                    const value_buffer = packet.slice(offset, offset + 1)
                    measurement['value'] = value_buffer.readUInt8(0);
                }

                flower['measurement'].push( measurement )
            }
            console.log(flower);
            saveFlower(flower);
        }
    }


    //Request for more data again
    Port.write(radioRX, (err,bytesWritten) => {
        if(err){ console.err(err); }
        console.info("Requesting for data .... sending radio rx 0");
        _CONN_STATE_ = RadioState.REQUEST;
    });

    
}

saveFlower = (flower) => {

    return Flower.findOne({ name: flower["name"]}, (err,res) => {
        if(err){ flower.save(); }
        else{
            console.info("Updating the flower");
            console.log(res);
            res.measurement = res.measurement.concat( flower["measurement"] );
            res.save()
            console.log(res);
        }
    }).exec();

    // return Flower.findOneAndUpdate({ name: flower['name'] }, flower, {upsert:true}, (err,doc,res) => {
    //     if(err){ console.error(`Error occurred while saving sunflower \n${err}`); }
    //     if(doc){ 
    //         console.info(`Updated document \n${doc}`); 
    //         // doc.measurement.push.apply(doc.measurement, flower['measurement']);
    //         // doc.save();
    //     }
    //     if(res){ console.info(`Result: ${res}`) };
    // }).exec()
};



// console.info("Testing data handler");
packet_string = "0004A30B0020F3B90115015FCC7438600A0163CC7438660A0167CC74385A0A"; //"1122334455667788010E015AE32B470A03015AE32B5009ED";
// dataHandler(packet_string); 
//Testing the class
const pollObject = setInterval(() => {
    _CONN_STATE_ = RadioState.RECIEVING;
    dataHandler( packet_string );
}, 60000); //Every 60s (minute)


process.on("exit", (opts, err) => {
    console.error(err);
    Port.close();
});