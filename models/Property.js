const mongoose = require('mongoose')
const appointmentSchema = new mongoose.Schema({
    desiredDate: {type: Date},
    user: {type: mongoose.Types.ObjectId, ref:'user'}
})
const propertySchema = new mongoose.Schema({
    agents:[{type: mongoose.Types.ObjectId, ref:'agent'}],
    city:{type: mongoose.Types.ObjectId, ref:'city'},
    address: {type: String, required: true},
    district: {type: String, required: true},
    photosURL: [],
    videoURL: {type: String, default: null},
    isBrandNew: {type: Boolean, default: false},
    isHouse: {type: Boolean, default: false},
    houseStyle: {type: String, required: true},
    forSale: {type: Boolean, default: false},
    shortRental: {type: Boolean, default: false},
    haveGarden: {type: Boolean, default: false},
    haveGarage: {type: Boolean, default: false},
    haveCameras: {type: Boolean, default: false},
    havePool: {type: Boolean, default: false},
    hasAttendant: {type: Boolean, default: false},
    numberOfBathrooms: {type: Number, required: true},
    numberOfBedrooms: {type: Number, required: true},
    numberOfRooms: {type: Number, required: true},
    roofedArea: {type: Number, required: true},
    totalArea: {type: Number, required: true},
    price: {type: Number, required: true},
    isUSD: {type: Boolean, default: false},
    rentDuration: {type: Number, default: 0},
    appointments: [appointmentSchema],
    postedAt: {type: Date, default: Date.now},
})
const Property = mongoose.model('property', propertySchema)

module.exports = Property