const express = require('express');
const router = express.Router();
const calendar = require('../controllers/calendar');
//const { isLoggedIn } = require('../middleware');

router.post('/createC', calendar.create);
router.get('/allCalendar', calendar.CalendarList);
router.get('/Calendar/:id', calendar.CalendarFindOne);
router.delete('/DelCalendar/:id', calendar.CalendarDel);
router.put('/UpdatCalendar/:id', calendar.CalendarUpdate);

module.exports = router;
