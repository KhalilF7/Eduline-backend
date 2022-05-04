const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseASSchema = new Schema({
    Name : {
        type: String,
       
    },
    Description : {
        type: String
    },
    Domain:{
        type: mongoose.Schema.Types.ObjectId, ref: 'domainAS',
      },
    Chapter:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'chapterAS',
      }],
      image: {
        type: String,
        default:null
    }

 

});

module.exports = mongoose.model('courseAS', courseASSchema)