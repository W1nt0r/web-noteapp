const noteModel = require("../service/note.js");

module.exports.showIndex = function (req, res) {
    let sort = getSortCriteria(req);
    let sortStates = getSortStates(req);
    let nextTheme = getNextTheme(req);
    let filter = {};
    let isFiltered = isFilter(req);
    if (isFiltered) {
        filter["done"] = false;
    }


    noteModel.all(filter, sort, (err, notes) => {
        if (err) {
            let err = new Error("A error while loading the Notes occured. Please try again later");
            res.render("error", {error: err, message: err.message});
        } else {
            res.render("note-master", {notes: notes, filterState: !isFiltered, style: nextTheme, sortStates: sortStates});
        }
    });

};

module.exports.showNewNote = function (req, res) {
    res.render("note-detail", {pagetitle: "Neue Todo"});
};

module.exports.showEditNote = function (req, res) {
    noteModel.get(req.params.id, (err, note) => {
        if (err) {
            let err = new Error("A error while loading the Note occured. Please try again later");
            res.render("error", {error: err, message: err.message});
        } else {
            res.render("note-detail", {pagetitle: "Ändere Todo", note: note});
        }
    });
};

module.exports.createNote = function (req, res) {
    noteChangeHelper(req, res, (title, description, importance, dueDate, done) => {
        noteModel.add(title, description, importance, dueDate, done, (err, newNotes) => {
            if (err) {
                let err = new Error("A error while creating the Notes occured. Please try again later");
                res.render("error", {error: err, message: err.message});
            } else {
                res.redirect("/");
            }
        });
    });
};

module.exports.updateNote = function (req, res) {
    noteChangeHelper(req, res, (title, description, importance, dueDate, done, id) => {
        noteModel.update(id, title, description, importance, dueDate, done, (err, note) => {
            if (err) {
                let err = new Error("A error while updating the Notes occured. Please try again later");
                res.render("error", {error: err, message: err.message});
            } else {
                console.log(note.dueDate);

                res.redirect("/");
            }
        });
    });
};

function noteChangeHelper(req, res, callback) {
    let errMsg = validateNoteFields(req.body);

    if (errMsg.length == 0) {
        let title = req.body.title;
        let description = req.body.description;
        let importance = Number(req.body.importance);
        let dueDate = req.body.dueDate;
        let done = false;
        let id = null;

        if (req.body.done && req.body.done == "done") {
            done = true;
        }

        if (req.params.id) {
            id = req.params.id;
        }

        callback(title, description, importance, dueDate, done, id);
    } else {
        let err = new Error("Some params weren't set correct: " + errMsg.join("\n"));
        res.render("error", {message: err.message});
    }
}

function getNextTheme(req) {
    if (req.query.style) {
        req.session.theme = req.query.style;

        if (req.query.style == "dark") {
            return "light";
        }
    }

    if (req.session.theme == "dark") {
        return "light";
    } else {
        return "dark";
    }
}

function isFilter(req) {
    if (req.query.filter) {
        if (req.query.filter.length != 0) {
            let value = (req.query.filter == "true");
            req.session.filter = value;

            return value;
        }
    }

    if (req.session.filter) {
        return req.session.filter;
    }

    return false;
}

function getSortCriteria(req) {
    let sort = {};
    prepareSortCriterias(req);

    if (req.session.sort.length != 0) {
        let fieldName = req.session.sort[0];
        let ascDesc = req.session.sort[1];

        sort[fieldName] = ascDesc;
    }

    return sort;
}

function getSortStates(req) {
    let sortStates = {
        dueDate: false,
        creationDate: false,
        importance: false
    };
    if (!req.session.sort) {
        return sortStates;
    }
    sortStates[req.session.sort[0]] = true;
    return sortStates;
}

function prepareSortCriterias(req) {
    if (req.query.sort) {
        let sort = req.query.sort;

        if (!req.session.sort) {
            req.session.sort = [sort, 1];
        } else {
            if (req.session.sort[0] == sort) {
                req.session.sort[1] = -req.session.sort[1];
            } else {
                req.session.sort = [sort, 1];
            }
        }
    } else {
        if (!req.session.sort) {
            req.session.sort = [];
        }
    }
}

function validateNoteFields(params) {
    let errMsg = [];

    if (!params.title || params.title == "") {
        errMsg.push("Title is not set");
    }

    if (!params.description || params.description == "") {
        errMsg.push("Description is not set");
    }

    if (!params.importance || params.importance == "") {
        errMsg.push("Importance is not set");
    } else {
        let importance = Number(params.importance);

        if (isNaN(importance)) {
            errMsg.push("Importance is not a number");
        } else {
            if (importance < 1 || importance > 5) {
                errMsg.push("Importance is out of bound [1;5]: " + importance);
            }
        }
    }

    if (!params.dueDate || params.dueDate == "") {
        errMsg.push("Due Date is not set");
    } else {
        let date = new Date(params.dueDate);

        if (!(date instanceof Date) || isNaN(date.valueOf())) {
            errMsg.push("Due Date is not a date");
        }
    }

    return errMsg;
}