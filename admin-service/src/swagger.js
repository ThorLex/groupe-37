const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Admin Service API',
      version: '1.0.0',
      description: 'API for managing demands, users, and statistics',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/demande.routes.js', './src/admin.routes.js'], // files containing annotations as above
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;