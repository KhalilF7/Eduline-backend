const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    isAdmin: {
      type: Boolean,
      default:false
  },
    Role: {
        type: String,
    },
    password:{
      type: String,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailToken: {
        type: String
    },
    date_creation: {
        type: Date,
        default: Date.now,
      },
      birth_date: {
        type: Date,
        
      },
      name: {
        type: String,
      },
      last_name: {
        type: String,
      },
      blocked: {
        type: Boolean, default: false
    }
}, { timestamp: true }      

      );
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);