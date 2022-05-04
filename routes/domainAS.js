const express = require('express');
const router = express.Router();
const domainAS = require('../controllers/domainAS');
//const { isLoggedIn } = require('../middleware');

router.post('/createD/:img', domainAS.create);
router.get('/allDomainsAS', domainAS.DomainsASList);
router.get('/allDomainsASCourses/:id', domainAS.DomainsASgetListC);
router.put('/allDomainsASCourses/:idD/:idC', domainAS.addTolist);
router.get('/DomainsAS/:id', domainAS.DomainsASFindOne);
router.delete('/DelDomainsAS/:id', domainAS.DomainsASDel);
router.put('/UpdateDomainsAS/:id', domainAS.DomainsASUpdate);

module.exports = router;
