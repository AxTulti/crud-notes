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
exports.validateNoteId = exports.validateNote = void 0;
const note_1 = __importDefault(require("../models/note"));
const fieldsValidations_1 = require("../validations/fieldsValidations");
/*
 * Theese are validations intended to be used
 * as middleware for the different routes.
 */
function validateNote(req, res, next) {
    /* this middleware validates if all the note fields are valid */
    // if the note is not defined, return an error
    if (req.body.note == undefined)
        return res.status(400).send('The note is not valid or not provided');
    // if the note is valid, continue
    const { note } = req.body;
    //const { title, subtitle, content, tags } = note; <-- this doesn't work because some of the fields can be undefined
    // validate the note fields
    // Title
    if (!fieldsValidations_1.isTitleValid(note.title))
        return res.status(400).send('Title is invalid: the title must be a string with at least 1 character');
    // Subtitle
    if (!fieldsValidations_1.isSubtitleValid(note.subtitle))
        return res.status(400).send('Subtitle is invalid: the subtitle must be a string with at least 1 character or not be decared at all');
    // Content
    if (!fieldsValidations_1.isContentValid(note.content))
        return res.status(400).send('Content is invalid: the content must be a string with at least 1 character or not be declared at all');
    // Tags
    if (!fieldsValidations_1.areTagsValid(note.tags))
        return res.status(400).send('Tags are invalid: the tags must be an array of strings with at least 1 element or not be declared at all');
    // All fields are valid
    if (!fieldsValidations_1.areAllFieldsValid(note))
        return res.status(400).send('Note is invalid: the note must be a valid note object');
    // Sanitize the note object
    req.note = fieldsValidations_1.prepareDataToBeSaved(note);
    next();
}
exports.validateNote = validateNote;
function validateNoteId(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        /* this middleware validates if the note id correspondes with the one of a database note */
        // if the note is not defined, return an error
        if (req.body.note == undefined)
            return res.status(400).send('The note object was not provided');
        // if the note id is not defined, return an error
        if (req.body.note.id == undefined)
            return res.status(400).send('The note id is was not found');
        const { id } = req.body.note;
        // Search for that note in the database
        const matchingNote = yield note_1.default.findOne({ _id: id, owner: req.token.email })
            .catch((err) => {
            console.log(err);
            // if the note id is not valid, return an error
            if (err.name === 'CastError')
                return res.status(400).send('The note id is invalid');
            return res.status(500).json(err);
        });
        // if the note was not found, return an error
        if (matchingNote == undefined)
            return res.status(400).send('The note was not found');
        // if the note was found, continue and set the note object in the request
        req.databaseNote = matchingNote;
        next();
    });
}
exports.validateNoteId = validateNoteId;
