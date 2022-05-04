const mongoose = require('mongoose');
const { Schema } = mongoose;

const demandSchema = new Schema({
    course: String,
    counter: { type: Number, default: 1 }
});

module.exports =mongoose.model('demand', demandSchema);