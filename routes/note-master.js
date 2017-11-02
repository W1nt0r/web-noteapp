var express = require('express');
var router = express.Router();

/* GET note-master page. */
router.get('/', function(req, res, next) {
    var notes = [
        {title: "Build a wall", description: "build a giant wall at the mexican border", importance: "5", dueDate: "4.12.2018", done: "0"},
        {title: "Deport immigrants", description: "deport all mexicans", importance: "4", dueDate: "8.7.2018", done: "0"},
        {title: "Improve health care", description: "something", importance: "1", dueDate: "anytime", done: "0"}
    ];

    res.render('note-master', { title: 'Note Master' , notes : notes});
});

module.exports = router;
