const express = require('express');
const multer = require('multer');
const path = require('path');
const { check } = require('./predictor');

const app = express();
const APP_ROOT = __dirname;
const PORT = 4555;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(APP_ROOT, 'public/images'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('upload');
});

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    const filename = file.filename;
    check(filename)
        .then(status => {
            res.render('complete', { image_name: filename, predvalue: status });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error processing image");
        });
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
