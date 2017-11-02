const express = require('express');
const router = express.Router();
const notes = require('../controller/noteController.js');

router.get("/", notes.showIndex);
router.post("/notes", notes.createNote);
router.get("/notes", notes.showNewNote);
router.get("/notes/:id/", notes.showEditNote);
router.post("/notes/:id/", notes.updateNote);

module.exports = router;