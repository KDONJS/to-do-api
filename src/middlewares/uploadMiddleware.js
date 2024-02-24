const { bucket } = require('../db/firebase');

function uploadFile(req, res, next) {
    if (!req.file) {
        return next();
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', err => next(err));

    blobStream.on('finish', () => {
        // Aquí puedes, por ejemplo, guardar la URL pública del archivo en req.body para usarla después
        req.body.imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        next();
    });

    blobStream.end(req.file.buffer);
}

module.exports = { uploadFile };
