const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const domainASSchema = new Schema({
    Name : {
        type: String,
       
    },
    Description : {
        type: String
    },
    courseAS:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'courseAS',
      }],
    image: {
        type: String,
        default:null
    }
 

});

module.exports = mongoose.model('domainAS', domainASSchema)