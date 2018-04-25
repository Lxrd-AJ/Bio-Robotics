
const SerialPort = require('serialport');
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
const portName = '/dev/SUN-FLOWER';
// const MockBinding = SerialPort.Binding;
// MockBinding.createPort( portName, { echo: true, record: true });
const Port = new SerialPort( portName , {baudRate: 57600 }, (err) => {
    if(err){ console.error(`Failed to connect to serial port ${portName}`); }
});

/**
 * Setup database connection
 */
Mongoose.connect('mongodb://localhost/flower');
const Database = Mongoose.connection;
Database.on('error', console.error.bind(console, "***Connection error:"));
Database.on('open', () => {
    console.info("Connection established to database");
    var flower = generateFakeData();
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


/**
 * Poll the Lora Module for new data occassionally and utilise `dataHandler` function for parsing
 * the data and storing it into the database
 */
const pollObject = setInterval(() => {
    console.info("Polling for new data ...");
    Port.write("mac pause", (err,bytesWritten) => {
        if(err){ console.error(err); }
        console.info("Executing pause command on mac ....");

        Port.write("radio rx 0", (err,bytesWritten) => {
            if(err){ console.err(err); }
            console.info("Requesting for data ....");
        });
    });
}, 60000); //Every 60s (minute)


dataHandler = (data) => {
    console.info(data);
}

Port.on("data", (data) => dataHandler(data));
Port.on("readable", () => dataHandler(Port.read()))