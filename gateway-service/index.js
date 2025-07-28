const express = require('express');
const httpProxy = require('express-http-proxy');
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware pour la sécurité avec x-api-key
app.use((req, res, next) => {
  if (req.headers['x-api-key'] === process.env.API_KEY) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Proxies pour les microservices
app.use('/users', httpProxy(process.env.USER_SERVICE_URL || 'http://localhost:4001'));
app.use('/admin', httpProxy(process.env.ADMIN_SERVICE_URL || 'http://localhost:4002'));
app.use('/payments', httpProxy(process.env.PAYMENT_SERVICE_URL || 'http://localhost:4003'));
app.use('/files', httpProxy(process.env.FILE_SERVICE_URL || 'http://localhost:4004'));

app.listen(PORT, () => {
  console.log(`Gateway API en cours d'exécution sur le port ${PORT}`);
});