const mongoose = require('mongoose')

const agentSchema = new mongoose.Schema({
    agentName: {type: String, required: true},
    address: {type: String, required: true},
    gMapAddress: {type: String, default: null},
    eMail: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    socialMedia: {facebook: {type: String}, twitter: {type: String}, instagram: {type: String}, whatsapp: {type: String}},
    photoURL: {type: String, required: true},
    city: {type: mongoose.Types.ObjectId, ref:'city', required: true}
})
const Agent = mongoose.model('agent', agentSchema)
module.exports = Agent