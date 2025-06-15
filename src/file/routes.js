const express = require('express');
const router = express.Router();
const controller = require('./controller');
const auth = require('../common/auth');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { mongoUri } = require('../common/config');

const storage = new GridFsStorage({
  url: mongoUri,
  file: (req, file) => ({
    filename: file.originalname,
    metadata: { demandeId: req.body.demandeId || null, userId: req.user ? req.user.userId : null }
  })
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Upload fichier
router.post('/upload', auth, upload.single('file'), controller.upload);
// Télécharger un fichier via son id
router.get('/:id/download', auth, controller.download);

module.exports = router;
