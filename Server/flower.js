const Mongoose = require('mongoose');

const FlowerSchema = Mongoose.Schema({
    name: String,
    measurement: [{
        type: {type:String, enum:['TEMP','HUMIDITY']},
        timestamp: Date,
        value: Number
    }]
}) 

module.exports = Flower = Mongoose.model('Flower', FlowerSchema);