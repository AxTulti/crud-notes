"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Use the .env file variables
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/*
 * * * * Imports * * *
 */
//  # Modules #
const express_1 = __importDefault(require("express")); // We are using express as our framework
const morgan_1 = __importDefault(require("morgan")); // We are using morgan to log requests to the console
// # Database #
const database_1 = __importDefault(require("./config/database"));
const note_1 = __importDefault(require("./models/note"));
database_1.default();
// # Middlware #
const tokenVerifications_1 = require("./middleware/tokenVerifications"); // this middlware verifies that there is a token in the req.body and that it is valid
const noteVerification_1 = require("./middleware/noteVerification");
/*
 * * * * Setting up the server * * *
 */
// Create the server
const app = express_1.default();
// # Server Variables #
app.set('port', process.env.PORT || 3000); // Default port is 3000
/*
 * * * * Middlware  * * *
 */
// use morgan
app.use(morgan_1.default('dev'));
// add json support
app.use(express_1.default.json());
/*
 * * * * Routes * * *
 * Theese are the routes that the server will respond to:
 *     POST - /create - the create route
 *     POST - /read - the read route
 *     POST - /numberOfNotes - the number of notes route
 *     POST - /readOne - the read one route
 *     PUT - /update - the update route
 *     DELETE - /delete - the delete route
 *     DELETE - /deleteAll - the deleteAll route
 */
// POST - /create - the create route - Ok
app.post("/create", tokenVerifications_1.verifyToken, noteVerification_1.validateNote, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* If this code is reched, it means that the client sent a valid token
     * so we can assume that the user is authenticated.
     * and the token information ( user_id, email, name, lastName ) is in the req.token
      
     * We can also asume that the note is valid, because the validateNote middleware,
     * which is called before this route, makes sure that the note is valid, and if
     * it is, it appends the note to the req.note
      
     * so all we need to do is save the note to the database, and send back a response.
     * theese are going to be the steps that we need to take to save the note to the database:
     * 1. Create a new instance of the NoteSchema with the req.note data
     * 2. Save the instance to the database
     * 3. Send back the noteSchema instance to the client
     */
    try {
        // 1. Create a new instance of the NoteSchema with the req.note data
        // 2. Save the instance to the database
        const { title, subtitle, content, tags } = req.note;
        const note = yield note_1.default.create({
            owner: req.token.email,
            title,
            subtitle,
            content,
            tags // this can be null/undefined
        });
        // 3. Send back the noteSchema instance to the client
        // 201 - Created
        res.status(201).json(note);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}));
// POST - /read - the read route - Ok
app.post("/read", tokenVerifications_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* If this code is reached, it means that the client sent a valid token
     * so we can assume that the user is authenticated.
     * and the token information ( user_id, email, name, lastName ) is in the req.token
     
     * This route will return all the notes that the user has created.
     * to do this we will need to follow the steps below:
     * 1. Get all the notes from the database that belong to the user
     * 2. Send back the notes to the client
     */
    try {
        // 1. Get all the notes from the database that belong to the user
        const notes = yield note_1.default.find({ owner: req.token.email });
        // 2. Send back the notes to the client
        res.json(notes);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}));
// POST - /readOne - the read one route - Ok
app.post("/readOne", tokenVerifications_1.verifyToken, noteVerification_1.validateNoteId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* If this code is reached, it means that the client sent a valid token
     * so we can assume that the user is authenticated.
     * and the token information ( user_id, email, name, lastName ) is in the req.token
     
     * This route will return the note that the user has requested.
     * to do this we will need to follow the steps below:
     * 1. Get the note from the req.databaseNote that belongs to the user with the id that the client sent (the ValidateNoteId middleware put it in the req.databaseNoteId)
     * 2. Send back the note to the client
     */
    try {
        // 1. Get the note from the req.databaseNote that belongs to the user with the id that the client sent (the ValidateNoteId middleware put it in the req.databaseNoteId)
        const note = req.databaseNote;
        // 2. Send back the note to the client
        res.json(note);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}));
// POST - /numberOfNotes - the number of notes route - Ok
app.post("/numberOfNotes", tokenVerifications_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* If this code is reached, it means that the client sent a valid token
     * so we can assume that the user is authenticated.
     * and the token information ( user_id, email, name, lastName ) is in the req.token
     
     * This route will return the number of notes that the user has created.
     * to do this we will need to follow the steps below:
     * 1. Get the number of notes from the database that belong to the user
     * 2. Send back the number of notes to the client
     */
    try {
        // 1. Get the number of notes from the database that belong to the user
        const numberOfNotes = yield note_1.default.countDocuments({ owner: req.token.email });
        // 2. Send back the number of notes to the client
        res.status(200).send({ numberOfNotes });
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}));
// PUT - /update - the update route - Ok
app.put("/update", tokenVerifications_1.verifyToken, noteVerification_1.validateNote, noteVerification_1.validateNoteId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* If this code is reached, it means that the client sent a valid token
     * so we can assume that the user is authenticated.
     * and the token information ( user_id, email, name, lastName ) is in the req.token
     
     * we can asume that the note (the new one) is valid, because the validateNote middleware,
     * and the validateNoteId middleware assures that the note id is valid, and the note itself is
     * stored in the req.databaseNote.
     
     * Now we need to update the note in the database.
     * To do that we need to follow the steps below:
     * 1. Get the note from the req.databaseNote
     * 2. Update the note with the req.note data
     * 3. Save the note to the database (not forgeting to redeclare the UpdatedAt field before saving it)
     * 4. Send back the updated note to the client
     */
    try {
        // Me need to add the updatedAt field to the note before saving it to the database to update it.
        req.note.updatedAt = new Date();
        // 1. Get the note from the req.databaseNote
        const { databaseNote } = req;
        // 2. Update the note with the req.note data
        Object.assign(databaseNote, req.note); // this code doesn't allow the client to change the updatedAt field, because the note was sanitized at the validateNote middleware.
        // 3. Save the note to the database (not forgeting to redeclare the UpdatedAt field before saving it)
        yield databaseNote.save();
        // 4. Send back the updated note to the client
        res.status(200).json(req.databaseNote);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}));
// DELETE - /delete - the delete route - Ok
app.delete("/delete", tokenVerifications_1.verifyToken, noteVerification_1.validateNoteId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* If this code is reached, it means that the client sent a valid token
     * so we can assume that the user is authenticated.
     * and the token information ( user_id, email, name, lastName ) is in the req.token
     
     * we can asume that the note id is valid, and the note itself is
     * stored in the req.databaseNote (because of the validateNoteId middleware).
     
     * Now we need to update the note in the database.
     * To do that we need to follow the steps below:
     * 1. Get the note from the req.databaseNote
     * 2. Delete the note from the database
     * 3. Send back a delete success message to the client
     */
    try {
        // 1. Get the note from the req.databaseNote
        const { databaseNote } = req;
        // 2. Delete the note from the database
        yield databaseNote.remove();
        // 3. Send back a delete success message to the client
        res.status(200).send("The note has been deleted succesfuly");
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}));
// DELETE - /deleteAll - the deleteAll route - Ok
app.delete("/deleteAll", tokenVerifications_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* If this code is reached, it means that the client sent a valid token
     * so we can assume that the user is authenticated.
     * and the token information ( user_id, email, name, lastName ) is in the req.token
     
     * Now we need to delete the notes.
     * To do that we need to follow the steps below:
     * 1. Get all the notes from the database that belong to the user
     * 2. Delete all the notes from the database
     * 3. Send back a delete success message to the client
     */
    try {
        // 1. Get all the notes from the database that belong to the user
        const notes = yield note_1.default.find({ owner: req.token.email });
        // 2. Delete all the notes from the database
        notes.forEach((note) => note.remove());
        // 3. Send back a delete success message to the client
        res.status(200).send("All the notes have been deleted succesfuly");
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}));
/*
 * * * * Listen to the server * * *
 */
app.listen(app.get('port'), () => {
    console.log('Server is listening on port ' + app.get('port'));
});
