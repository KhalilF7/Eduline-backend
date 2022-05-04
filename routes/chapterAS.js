const express = require('express');
const router = express.Router();
const chapterAS = require('../controllers/chapterAS');
//const { isLoggedIn } = require('../middleware');

router.post('/createC', chapterAS.create);
router.get('/allChaptersAS', chapterAS.ChapterASList);
router.get('/ChaptersAS/:id', chapterAS.ChaptersASFindOne);
router.delete('/DelChaptersAS/:id', chapterAS.ChaptersASDel);
router.put('/UpdatChapterAS/:id', chapterAS.ChaptersASUpdate);
router.get('/getCourseChp/:id', chapterAS.ChapterASListByC);

module.exports = router;
