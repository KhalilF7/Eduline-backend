const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calendarSchema = new Schema({
    Description : {
        type: String
    },
    Title : {
        type: String
    },
    id_Cour: {
        type: String,
       
    },
    id_User : {
        type: String
    },
 

});

module.exports = mongoose.model('calendar', calendarSchema)