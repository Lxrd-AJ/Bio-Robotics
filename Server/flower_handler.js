const Flower = require('./flower');
const MeasurementEnum = { TEMP:'TEMP', HUMIDITY: 'HUMIDITY' };
Object.freeze(MeasurementEnum)

/**
 * Returns a promise overview of the flower objects in the database
 * returns - number of flowers
 * - average temperature of flowers
 * - average humidity of flowers
 */
exports.overview = function(){    
    return Flower.find({}).exec().then((flowers) => {
        N = flowers.length        
        last_measurements = flowers.map((flower,idx) => flower.measurement.pop()).filter((x) => x != undefined);        
        humidity = last_measurements
                        .filter((measurement) => measurement.type == MeasurementEnum.HUMIDITY)
        temperature = last_measurements
                        .filter((measurement,idx) => measurement.type == MeasurementEnum.TEMP)
        avg_humidity = 0
        avg_temp = 0
        
        if(temperature.length > 0){
            avg_temp = temperature.map((measurement) => measurement.value)
                            .reduce((acc,cur) => acc + cur)
        }

        if (humidity.length > 0){
            avg_humidity = humidity.map((measurement) => measurement.value)
                                .reduce((acc,cur) => acc + cur)
        }
        
        return {
            "num_flowers": flowers.length,
            "avg_temp": (avg_temp ? avg_temp /= N : 0),
            "avg_humidity": (avg_humidity ? avg_humidity/N : 0 )
        };        
    }, (err) => {
        console.error(err)
        return err
    })
}