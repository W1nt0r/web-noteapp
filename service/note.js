const Datastore = require('nedb');
const db = new Datastore({ filename: '../db/note.db', autoload: true });

function Note(title, description, importance, dueDate, done) {
    this.title = title;
    this.description = description;
    this.importance = importance;
    this.dueDate = dueDate;
    this.creationDate = new Date();
    this.done = done;
}

function addNote(title, description, importance, dueDate, done, callback) {
    let note = new Note (title, description, importance, dueDate, done);

    db.insert(note, callback);
}

function updateNote(id, title, description, importance, dueDate, done, callback) {
    db.update({_id: id}, { title: title, description: description, importance: importance, dueDate: dueDate, done: done}, {}, callback);
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

module.exports = {add : addNote, delete : removeNote, get : getNote, all : getAll , update: updateNote };