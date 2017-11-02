const moment = require("moment-timezone");
const noteModel = require("../service/note.js");

module.exports.showIndex = function(req, res) {
    res.render("dummyindex");
};

module.exports.showNewNote = function (req, res) {
    res.render("note-detail", {pagetitle: "Neue Todo"});
};

module.exports.showEditNote = function (req, res) {
    noteModel.get(req.params.id, (err, note) => {
        if(err) {
            //show/render errors
        } else {
            console.log(note.dueDate);

            res.render("note-detail", {pagetitle: "Ändere Todo", note: note});
        }
    });
};

module.exports.createNote = function(req, res) {
    noteChangeHelper(req, res, (title, description, importance, dueDate, done) => {
        noteModel.add(title, description, importance, dueDate, done, (err, newNotes) => {
            if(err) {
                //show/render errors
            } else {
                res.render("dummyindex", {pagetitle: "MyPagetitle New"});
            }
        });
    });
};

module.exports.updateNote = function (req, res) {
    noteChangeHelper(req, res, (title, description, importance, dueDate, done, id) => {
        noteModel.update(id, title, description, importance, dueDate, done, (err, note) => {
            if(err) {
                //show/render errors
            } else {
                console.log(note.dueDate);

                res.render("dummyindex", {pagetitle: "MyPagetitle Update"})
            }
        });
    });
};

function noteChangeHelper(req, res, callback) {
    let errMsg = validateNoteFields(req.body);

    if(errMsg.length == 0) {
        let title = req.body.title;
        let description = req.body.description;
        let importance = Number(req.body.importance);
        let dueDate = moment(req.body.dueDate).tz("Europe/Zurich").toDate();
        let done = false;
        let id = null;

        if(req.body.done && req.body.done == "done") {
            done = true;
        }

        if(req.params.id) {
            id = req.params.id;
        }

        callback(title, description, importance, dueDate, done, id);
    } else {
        //show/render errors
    }
}

function validateNoteFields(params) {
    let errMsg = [];

    if(!params.title || params.title == "") {
        errMsg.push("Title is not set");
    }

    if(!params.description || params.description == "") {
        errMsg.push("Description is not set");
    }

    if(!params.importance || params.importance == "") {
        errMsg.push("Importance is not set");
    } else {
        if(isNaN(Number(params.importance))) {
            errMsg.push("Importance is not a number");
        }
    }

    if(!params.dueDate || params.dueDate == "") {
        errMsg.push("Due Date is not set");
    } else {
        let date = new Date(params.dueDate);

        if(!(date instanceof Date) || isNaN(date.valueOf())) {
            errMsg.push("Due Date is not a date");
        }
    }

    return errMsg;
}