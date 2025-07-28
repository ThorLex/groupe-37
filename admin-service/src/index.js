const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.send('Admin Service OK'));

const demandeRoutes = require('./demande.routes');
app.use('/demandes', demandeRoutes);

const adminRoutes = require('./admin.routes');
app.use('/admin', adminRoutes); // Nouvelle route pour les fonctionnalités admin/superadmin

const PORT = process.env.PORT || 4003;
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/admin', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log('Admin Service sur port', PORT)))
  .catch(err => console.error('Erreur MongoDB:', err));