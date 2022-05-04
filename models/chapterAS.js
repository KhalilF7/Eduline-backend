const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chapterASSchema = new Schema({
    Name : {
        type: String,
       
    },
    Description : {
        type: String
    },
    Lien : {
        type: String,
        default:null
    },
    
 

});

module.exports = mongoose.model('chapterAS', chapterASSchema)