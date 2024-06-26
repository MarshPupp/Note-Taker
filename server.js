const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = 3000;
const app = express();

//read from database 
const readDb = () => {
    const data = fs.readFileSync(path.join(__dirname, 'db','db.json'), 'utf8');
    return JSON.parse(data);
}

//write to database
const writeDb = (data) => {
    fs.writeFileSync(path.join(__dirname, 'db','db.json'), JSON.stringify(data, null, 2));
}

//middleware
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static('public'));

//GET route for notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname,'public','notes.html'))
});

//GET route to return saved notes from database
app.get('/api/notes', (req, res) => {
const noteData = readDb();
res.json(noteData);
});

//POST route to save a new note
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    const newNote = {
        title,
        text,
    };
    newNote.id = uuidv4()

    const noteData = readDb();
    noteData.push(newNote);
    writeDb(noteData);

    res.json(newNote);
});

//DELETE route to remove saved notes
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    let noteData = readDb();
    noteData = noteData.filter(noteData => noteData.id !== noteId);
    writeDb(noteData);
    console.log(noteData);
    res.json({ message: 'Your note has been deleted' });
});

//default catch-all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

//Starts server and listen for http requests
app.listen(PORT, () => {
    console.log('Server is listening at http://localhost: ${PORT}')
});