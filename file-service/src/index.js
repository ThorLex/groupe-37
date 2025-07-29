const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const fileRoutes = require('./file.routes');
app.use('/files', fileRoutes);
app.get('/', (req, res) => res.send('File Service OK'));
const PORT = process.env.FILE_SERVICE_PORT || 4004;
const MONGO_URI = `${process.env.MONGO_URI}/${process.env.FILE_DB_NAME}`;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log('File Service sur port', PORT)))
  .catch(err => console.error('Erreur MongoDB:', err));
