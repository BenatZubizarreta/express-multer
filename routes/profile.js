var express = require('express');
var router = express.Router();
const multer  = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter, 
    limits: { fileSize: 2 * 1024 * 1024 }
});

function fileFilter(req, file, cb) {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('PNG eta JPG fitxategiak soilik onartzen dira.'));
    }

    cb(null, true);
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('form.html');
});

router.post('/', upload.single('avatar'), function (req, res, next) {
    console.log(req.file)
    // req.body will hold the text fields, if there were any
    res.send("Jasota")
})


module.exports = router;
