const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const paymentRoutes = require('./payment.routes');
app.use('/payments', paymentRoutes);
// TODO: routes payment & notification
app.get('/', (req, res) => res.send('Payment & Notification Service OK'));
const PORT = process.env.PAYMENT_SERVICE_PORT || 4003;
const MONGO_URI = `${process.env.MONGO_URI}/${process.env.PAYMENT_DB_NAME}`;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log('Payment/Notification Service sur port', PORT)))
  .catch(err => console.error('Erreur MongoDB:', err));
