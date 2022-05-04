const express = require("express");

const forums = require("../controllers/forums.js");

const router = express.Router();

router.get('/search', forums.getForumsBySearch);
router.get('/', forums.getForums);
router.get('/:userId', forums.getForumsByUser);
router.get('/forum/:id', forums.getForum);
router.get('/stackoverflow/:query', forums.getStackoverflowAnswers);

router.post('/', forums.createForum); // you need to be loged in to create a post
router.patch('/:id', forums.updateForum);
router.delete('/:id', forums.deleteForum);
router.patch('/:id/likeForum', forums.likeForum);
router.post('/:id/commentForum', forums.commentForum);

module.exports = router;