var express = require('express');
var router = express.Router();

/* GET note-master page. */
router.get('/', function(req, res, next) {
    res.render('note-master', { title: 'Note Master' });
});

module.exports = router;
