const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const path = require('path');

// Importaciones de Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(cors());
app.use(express.json());

// Servir la carpeta public para el frontend
app.use(express.static(path.join(__dirname, '../public')));

// Importar rutas
const tenantRoutes = require('./routes/tenantRoutes');
const productRoutes = require('./routes/productRoutes');

// Usar rutas
app.use('/api/tenants', tenantRoutes);
app.use('/api/products', productRoutes);

// Importar rutas
const orderRoutes = require('./routes/orderRoutes');

// Usar rutas 
app.use('/api/orders', orderRoutes);

// Montar la interfaz de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'API funcionando' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});

module.exports = app;