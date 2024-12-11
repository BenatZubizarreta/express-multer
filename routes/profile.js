var express = require('express');
var router = express.Router();
const multer  = require('multer')
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '../public/uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, path.join(__dirname, '../public/uploads'));
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
/*
router.post('/', upload.single('avatar'), function (req, res, next) {
    const name = req.body.name;
    const file = req.file;

    if (!file) {
        return res.status(400).send('Irudia ezin izan da igo.');
    }

    const fileUrl = `http://localhost:3000/uploads/${file.filename}`;
    const responseText = `Zure izena: ${name}. Fitxategia: <a href="${fileUrl}">${fileUrl}</a>`;
    res.send(responseText);
});
*/
router.post('/', upload.single('avatar'), function (req, res, next) {
    const name = req.body.name;
    const file = req.file;

    if (!file) {
        return res.status(400).send('Irudia ezin izan da igo.');
    }

    // Detectar si estamos en un Codespace
    const isCodespace = process.env.CODESPACE_NAME;
    const baseUrl = isCodespace
        ? `http://${process.env.CODESPACE_NAME}-3000.preview.app.github.dev`
        : `${req.protocol}://${req.get('host')}`;

    // Construir URL completa del archivo
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;

    // Enviar respuesta con el nombre y enlace al archivo
    const responseText = `Zure izena: ${name}. Fitxategia: <a href="${fileUrl}">${fileUrl}</a>`;
    res.send(responseText);
});




module.exports = router;
