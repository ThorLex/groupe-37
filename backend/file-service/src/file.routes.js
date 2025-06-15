const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');

const storage = new GridFsStorage({
  url: process.env.MONGO_URI || 'mongodb://mongo:27017/file',
  file: (req, file) => ({ filename: file.originalname })
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Upload fichier
router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ fileId: req.file.id, filename: req.file.filename });
});

// Télécharger un fichier
router.get('/:id/download', async (req, res) => {
  try {
    const conn = mongoose.connection;
    const gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'fs' });
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    gfs.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    res.status(500).json({ message: 'Erreur téléchargement', error: err.message });
  }
});

module.exports = router;
