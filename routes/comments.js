const express = require("express");

const comments = require("../controllers/comments.js");

const router = express.Router();

router.post('/:id', comments.createComment); // you need to be loged in to create a comment
router.delete('/comments/:id', comments.deleteComment);
module.exports = router;