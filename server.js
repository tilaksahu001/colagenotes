const express = require('express');
const app = express();
const port = 3000;

// Serve static files (like your HTML, CSS, and JavaScript files)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
// Add this route to get all notes
app.get('/get-notes', (req, res) => {
    const notesFile = 'notes.json';

    // Read the notes from the file
    fs.readFile(notesFile, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to load notes' });
        }
        const notes = JSON.parse(data);
        res.json(notes);
    });
});
// Route to handle deleting a note by index
app.delete('/delete-note/:index', (req, res) => {
    const noteIndex = req.params.index; // Get the note index from URL params
    const notesFile = 'notes.json'; // The file where notes are stored

    // Read existing notes from the file
    fs.readFile(notesFile, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to load notes' });
        }
        let notes = JSON.parse(data); // Parse existing notes

        // Ensure index is valid
        if (noteIndex < 0 || noteIndex >= notes.length) {
            return res.status(400).json({ error: 'Invalid note index' });
        }

        // Remove the note from the array
        notes.splice(noteIndex, 1);

        // Write the updated notes back to the file
        fs.writeFile(notesFile, JSON.stringify(notes), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete note' });
            }
            res.json({ message: 'Note deleted successfully' });
        });
    });
});
// Route to handle editing a note by index
app.put('/edit-note/:index', (req, res) => {
    const noteIndex = req.params.index; // Get the note index from URL params
    const updatedNote = req.body; // Get the updated note from the request body
    const notesFile = 'notes.json'; // The file where notes are stored

    // Read existing notes from the file
    fs.readFile(notesFile, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to load notes' });
        }
        let notes = JSON.parse(data); // Parse existing notes

        // Ensure the note index is valid
        if (noteIndex < 0 || noteIndex >= notes.length) {
            return res.status(400).json({ error: 'Invalid note index' });
        }

        // Update the note
        notes[noteIndex] = updatedNote;

        // Write the updated notes back to the file
        fs.writeFile(notesFile, JSON.stringify(notes), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to update note' });
            }
            res.json({ message: 'Note updated successfully' });
        });
    });
});
