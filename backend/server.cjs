const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

// Allow cross-origin requests from your Vue app
app.use(cors());
app.use(express.static('docs'));

// Set up SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');

    // Create a sample table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS docs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `);
  }
});

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'docs'); // Destination folder
  },
  filename: (req, file, cb) => {
    const title = req.body.title || 'untitled'; // Get the title from the form data
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, `${title}${ext}`); // Save file as title.ext
  }
});

const upload = multer({ storage });

// Middleware to parse JSON
app.use(express.json());

// API Route: Get all docs
app.get('/docs', (req, res) => {
  db.all('SELECT * FROM docs', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ docs: rows });
  });
});

app.get('/categories', (req, res) => {
  db.all('SELECT * FROM categories', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ categories: rows });
  });
});

app.post('/categories', (req, res) => {
  const { name } = req.body;
  const query = 'INSERT INTO categories (name) VALUES (?)';
  db.run(query, [name], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

app.get('/docs/:category', (req, res) => {
  const category = req.params.category;
  db.all('SELECT * FROM docs WHERE category = ?', [category], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ docs: rows });
  });
});

// API Route: Add a new doc
app.post('/docs', (req, res) => {
  const { title, category, content } = req.body;
  const query = 'INSERT INTO docs (title, category, content) VALUES (?, ?, ?)';
  db.run(query, [title, category, content], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// API Route: Upload a file
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = `http://localhost:${port}/${req.file.filename}`; // Corrected PORT variable to 'port'
  res.json({ link: filePath }); // Send back the file link
});

app.delete('/docs/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM docs WHERE id = ?';
  db.run(query, id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Doc deleted' });
  });
}),

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
