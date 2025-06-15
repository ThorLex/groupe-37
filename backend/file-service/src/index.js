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
const PORT = process.env.PORT || 4004;
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/file', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log('File Service sur port', PORT)))
  .catch(err => console.error('Erreur MongoDB:', err));
