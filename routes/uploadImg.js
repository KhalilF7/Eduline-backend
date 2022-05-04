const express = require('express');
const router = express.Router();
const multer = require('multer');
const img = require('../controllers/img');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, '../client/public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

var upload = multer({ storage: storage }).single('file')
router.post('/upload',img.uploadImg);
module.exports = router;