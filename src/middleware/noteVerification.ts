import express from 'express';
import NoteSchema from '../models/note';
import { isTitleValid, isSubtitleValid, isContentValid, areTagsValid, areAllFieldsValid, prepareDataToBeSaved } from '../validations/fieldsValidations';
/*
 * Theese are validations intended to be used
 * as middleware for the different routes.
 */

function validateNote(req: express.Request | any, res: express.Response, next: express.NextFunction) {
    /* this middleware validates if all the note fields are valid */

    // if the note is not defined, return an error
    if ( req.body.note == undefined ) return res.status(400).send('The note is not valid or not provided');

    // if the note is valid, continue
    const { note } = req.body;

    //const { title, subtitle, content, tags } = note; <-- this doesn't work because some of the fields can be undefined

    // validate the note fields
    // Title
    if (!isTitleValid(note.title)) return res.status(400).send('Title is invalid: the title must be a string with at least 1 character');

    // Subtitle
    if (!isSubtitleValid(note.subtitle)) return res.status(400).send('Subtitle is invalid: the subtitle must be a string with at least 1 character or not be decared at all');

    // Content
    if (!isContentValid(note.content)) return res.status(400).send('Content is invalid: the content must be a string with at least 1 character or not be declared at all');

    // Tags
    if (!areTagsValid(note.tags)) return res.status(400).send('Tags are invalid: the tags must be an array of strings with at least 1 element or not be declared at all');

    // All fields are valid
    if (!areAllFieldsValid(note)) return res.status(400).send('Note is invalid: the note must be a valid note object');

    // Sanitize the note object
    req.note = prepareDataToBeSaved(note);
    next();
}

async function validateNoteId(req: express.Request | any, res: express.Response, next: express.NextFunction) {
    /* this middleware validates if the note id correspondes with the one of a database note */

    // if the note is not defined, return an error
    if ( req.body.note == undefined ) return res.status(400).send('The note object was not provided');

    // if the note id is not defined, return an error
    if ( req.body.note.id == undefined ) return res.status(400).send('The note id is was not found');
    const { id } = req.body.note;

    // Search for that note in the database
    const matchingNote = await NoteSchema.findOne({ _id: id, owner: req.token.email })
    .catch((err: any) => {
        console.log(err);

        // if the note id is not valid, return an error
        if (err.name === 'CastError') return res.status(400).send('The note id is invalid');

        return res.status(500).json(err);

    });

    // if the note was not found, return an error
    if (matchingNote == undefined) return res.status(400).send('The note was not found');

    // if the note was found, continue and set the note object in the request
    req.databaseNote = matchingNote;
    next();
}

export { validateNote, validateNoteId };