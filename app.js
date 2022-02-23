const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const NodeID3 = require('node-id3');
const jsmediatags = require('jsmediatags');

//express app
const app = express();

//middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//connect to mongodb
const dbURI = 'mongodb+srv://john:twilight@nodetuts.af2pk.mongodb.net/node-tuts?retryWrites=true&w=majority';
const conn = mongoose.createConnection(dbURI);
    // .then((result) => app.listen(3000), console.log('connected to db'))
    // .catch((err) => console.log(err));

//Initialize gfs
let gfs;

//Initialize stream
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('node-tuts');
})

//create storage engine
const storage = new GridFsStorage({
    url: dbURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'node-tuts'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

//routes
// @desc display home page
app.get('/', (req, res) => {
    // 
    gfs.files.find().toArray((err, files) => {
      //if no files exist
      if(!files || files.length === 0 ) {
        res.render('index', { title: 'Home' , files: false});
      } else {
        files.map(file => {
          if(file.contentType === 'audio/x-m4a' || file.contentType === 'audio/flac')
          {
            file.isAudio = true;
          } else {
            file.isAudio = false;
          }
        })
        res.render('index', { title: 'Home' , files});
      }
    })
})

// @desc display single song in viewSong
app.get('/viewSong', (req, res) => {
    var valid = req.query.valid;
    const tag = new jsmediatags.Reader('/audio/' + valid)
    .read({
      onSuccess: (tag) => {
        console.log('Success!');
        console.log(tag);
      },
      onError: (error) => {
        console.log('Error');
        console.log(error);
      }
  });

    res.render('viewSong', { title: 'Song title', valid });
})

// @desc display song upload page
app.get('/upload', (req, res) => {
    res.render('upload', { title: 'Upload a song' });
})

// @desc upload song to db
app.post('/upload', upload.single('file'), (req, res) => {
    //res.json({file: req.file});
    res.redirect('/viewSong/?valid=' + req.file.filename);
})

// @desc display all files in json
app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    //if no files exist
    if(!files || files.length === 0 ) {
      return res.status(404).json({
        err: 'No files exist'
      })
    }

    return res.json(files);
  })
})

// @desc display single file in json
app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    //if no files exist
    if(!file || file.length === 0 ) {
      return res.status(404).json({
        err: 'No file exists'
      })
    }

    return res.json(file);
  })
})

// @desc get audio file
app.get('/audio/:filename', (req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    //if no files exist
    if(!file || file.length === 0 ) {
      return res.status(404).json({
        err: 'No file exists'
      })
    }

    if (file.contentType === 'audio/x-m4a' || file.contentType === 'audio/flac') {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'file error'
      })
    }
  })
})

const port = 3000;

app.listen(port, () => console.log('Server started on port 3000'));