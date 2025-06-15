// Point d'entrée principal
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { mongoUri } = require('./common/config');
const logger = require('./common/logger');
const rateLimiter = require('./common/rateLimit');
const errorHandler = require('./common/errorHandler');

const userRoutes = require('./user/routes');
const fileRoutes = require('./file/routes');
const demandeRoutes = require('./demande/routes');
const notificationRoutes = require('./notification/routes');
const paymentRoutes = require('./payment/routes');
const auditRoutes = require('./audit/routes');
const { initGridFS } = require('./file/gridfs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(logger);
app.use(rateLimiter);

// Routes
app.use('/users', userRoutes);
app.use('/files', fileRoutes);
app.use('/demandes', demandeRoutes);
app.use('/notifications', notificationRoutes);
app.use('/payments', paymentRoutes);
app.use('/audit', auditRoutes);

// Gestion des erreurs
app.use(errorHandler);

// Connexion MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((conn) => {
    console.log('MongoDB connecté');
    initGridFS(conn.connection);
  })
  .catch(err => console.error('Erreur MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
