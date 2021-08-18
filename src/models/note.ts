import mongoose from 'mongoose'; // We import mongoose to create the note schema

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
    owner: { // The user who created the note (email).
        type: String,
        required: true // Obligatory.
    },

    createdAt: { // The date the note was created.
        type: Date,
        default: Date.now // We don't need to declare this field. Mongoose will do it for us.
    },

    updatedAt: { // The date the note was last updated.
        type: Date,
        default: Date.now // We don't need to declare this field (on the first save). We will have to redeclare it each time we update the note.
    },

    title: { // The title of the note.
        type: String,
        required: true // Obligatory.
    },

    subtitle: { // The subtitle of the note.
        type: String,
        required: false // Optional.
    },

    content: { // The content of the note.
        type: String,
        required: false // Optional.
    },

    tags: { // The tags of the note.
        type: [String], // A list of strings.
        required: false // Optional.
    }
}
const NoteSchema = new mongoose.Schema(notesFields);

// We export the NoteSchema.
export default mongoose.model('Note', NoteSchema, 'notes');