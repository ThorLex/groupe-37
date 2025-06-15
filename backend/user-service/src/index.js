const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const userRoutes = require('./user.routes');
app.use('/users', userRoutes);
app.get('/', (req, res) => res.send('User Service OK'));
const PORT = process.env.PORT || 4001;
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/user', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log('User Service sur port', PORT)))
  .catch(err => console.error('Erreur MongoDB:', err));
