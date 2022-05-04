const express = require('express');
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

var upload = multer({ storage: storage }).single('file')
exports.uploadImg = async (req, res) => {
     console.log("img en cour")
     console.log(req.body)
    upload(req, res, function (err) {
        console.log(req.body)
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
           console.log(req.file.filename)
           
      return res.status(200).send(req.file)

    })

};