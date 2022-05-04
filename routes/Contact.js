const express = require("express");

const contact = require("../controllers/contact");

const router = express.Router();

router.post('/post', contact.create);

module.exports = router;