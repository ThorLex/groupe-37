const { getGFS } = require('./gridfs');
const { ObjectId } = require('mongodb');

exports.upload = (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: 'Aucun fichier uploadé' });
  res.json({ fileId: req.file.id, filename: req.file.filename, userId: req.user.userId });
};

exports.download = async (req, res, next) => {
  try {
    const gfs = getGFS();
    const fileId = new ObjectId(req.params.id);
    const files = await gfs.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) return res.status(404).json({ message: 'Fichier non trouvé' });
    res.set('Content-Type', files[0].contentType || 'application/octet-stream');
    gfs.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    next(err);
  }
};
