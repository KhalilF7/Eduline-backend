const express = require("express");

const answers = require("../controllers/answers.js");

const router = express.Router();

//router.get('/', getAnswers);


router.post('/', answers.createAnswer);
//ajouter votes et delete routers

router.delete('/:id', answers.deleteAnswer);
router.patch('/:id/plusVote', answers.plusVote);
router.patch('/:id/moinVote', answers.moinVote);
module.exports = router;