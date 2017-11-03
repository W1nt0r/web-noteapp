const Datastore = require('nedb');
const moment = require("moment-timezone");
const db = new Datastore({ filename: '../db/note.db', autoload: true });

function Note(title, description, importance, dueDate, done) {
    this.title = title;
    this.description = description;
    this.importance = importance;
    this.dueDate = moment(dueDate).tz("Europe/Zurich").toDate();
    this.creationDate = moment(new Date()).tz("Europe/Zurich").toDate();
    this.done = done;
}

function addNote(title, description, importance, dueDate, done, callback) {
    let note = new Note (title, description, importance, dueDate, done);

    if(validateDueDate(note.creationDate, note.dueDate)) {
        note.creationDate = dueDate;
    }

    db.insert(note, callback);
}

function updateNote(id, title, description, importance, dueDate, done, callback) {
    getNote(id, (err, note) =>{
        if(err) {
            callback(err);
        } else {
            let creationDate = note.creationDate;

            if(validateDueDate(creationDate, dueDate)) {
                dueDate = creationDate;
            }

            db.update({_id: id}, { title: title, description: description, importance: importance, dueDate: dueDate, done: done}, {}, callback);
        }
    });


}

function removeNote(id, callback) {
    db.remove({_id: id}, {}, callback);
}

function getNote(id, callback) {
    db.findOne({_id: id}, callback);
}

function getAll(filter, sort, callback) {
    db.find(filter).sort(sort).exec(callback);
}

function validateDueDate(creationDate, dueDate) {
    return creationDate <= dueDate;
}

module.exports = {add : addNote, delete : removeNote, get : getNote, all : getAll , update: updateNote };