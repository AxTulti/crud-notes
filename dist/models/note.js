"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose")); // We import mongoose to create the note schema
/* * * Note Schema * * *
 * Each note should have the following properties:
 * owner - Obligatory. The user who created the note (email). String.
 * CreatedAt - Obligatory. The date the note was created. Date.
 * UpdatedAt - Obligatory. The date the note was last updated. Date.

 * title - Obligatory. String
 * subtitle - Optional. String
 * content - Optional. String
 * tags - Optional. Array of strings
 */
const notesFields = {
    owner: {
        type: String,
        required: true // Obligatory.
    },
    createdAt: {
        type: Date,
        default: Date.now // We don't need to declare this field. Mongoose will do it for us.
    },
    updatedAt: {
        type: Date,
        default: Date.now // We don't need to declare this field (on the first save). We will have to redeclare it each time we update the note.
    },
    title: {
        type: String,
        required: true // Obligatory.
    },
    subtitle: {
        type: String,
        required: false // Optional.
    },
    content: {
        type: String,
        required: false // Optional.
    },
    tags: {
        type: [String],
        required: false // Optional.
    }
};
const NoteSchema = new mongoose_1.default.Schema(notesFields);
// We export the NoteSchema.
exports.default = mongoose_1.default.model('Note', NoteSchema, 'notes');
