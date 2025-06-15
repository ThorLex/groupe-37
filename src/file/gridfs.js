// Gestion du stockage de fichiers avec GridFS
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let gfs;

function initGridFS(conn) {
  gfs = new GridFSBucket(conn.db, { bucketName: 'uploads' });
}

function getGFS() {
  if (!gfs) throw new Error('GridFS non initialisé');
  return gfs;
}

module.exports = { initGridFS, getGFS };
