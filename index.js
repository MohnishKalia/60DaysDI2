const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const multer = require('multer');

const { locations, topics } = require('./requirements');

const start = new Date('April 12, 2020 00:01:23');
const now = new Date();
const msSpan = now - start;
const sSpan = msSpan / 1000;
const daySpan = Math.floor(sSpan / (60 * 60 * 24));
const week = Math.ceil(daySpan / 7);
const day = (daySpan) % 7;

const dayMap = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];
const payload = {
    week,
    day: dayMap[day],
    daySpan,
    location: locations[day],
    topic: topics[daySpan],
};
console.log(payload);

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, './photos');
    },
    filename: function (_req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

const { IPV4, PORT } = process.env;

app.use(express.static('./public'));

app.post('/images/upload', upload.single('photo'), (req, res) => {
    console.log(req.file);
    res.redirect('/');
});

app.get('/topic', (req, res) => {
    res.json(payload);
})

app.listen(PORT, IPV4, () => console.log(`Server listening on http://${IPV4}:${PORT}`));