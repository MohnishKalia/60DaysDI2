const express = require('express');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
const app = express();
require('dotenv').config();
const multer = require('multer');

const { locations, topics, folderWeekIds } = require('./requirements');

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

app.get('/topic', (req, res) => {
    res.json(payload);
});

const { installed: { client_secret, client_id, redirect_uris } } = require('./credentials.json');
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(require('./token.json'));

app.post('/images/upload', upload.single('photo'), (req, res) => {
    console.log(req.file);
    console.log(req.body);
    const { photoname } = req.body;
    const ext = path.extname(req.file.filename);
    
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const fileMetadata = {
        'name': `day${daySpan + 1}_kalia_${payload.topic}${photoname.trim() ? '_' + photoname : ''}.${ext}`,
        parents: [folderWeekIds[week - 1]]
    };
    const media = {
        mimeType: `image/${ext}`,
        body: fs.createReadStream(`./photos/${req.file.filename}`)
    };

    console.log(fileMetadata)
    console.log(media);
    // drive.files.create({
    //     resource: fileMetadata,
    //     media: media,
    //     fields: 'id'
    // }, function (err, file) {
    //     if (err) {
    //         // Handle error
    //         console.error(err);
    //     } else {
    //         console.log('File Id: ', file.id);
    //     }
    // });
    res.redirect('/');
});

app.listen(PORT, IPV4, () => console.log(`Server listening on http://${IPV4}:${PORT}`));