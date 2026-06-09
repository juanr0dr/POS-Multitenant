const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Headless E-commerce Multitenant API',
            version: '1.0.0',
            description: 'API para la gestión aislada de tiendas, catálogos y órdenes.',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Servidor Local'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Ingresa tu token JWT con el prefijo "Bearer "'
                }
            }
        }
    },
    // Le indicamos a Swagger dónde buscar los comentarios de documentación
    apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
module.exports = swaggerDocs;