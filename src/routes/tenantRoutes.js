const express = require('express');
const router = express.Router();
const { registerTenant, loginTenant } = require('../controllers/tenantController');

// Ruta: POST /api/tenants/register
/**
 * @swagger
 * tags:
 *   name: Tenants
 *   description: Gestión de tiendas y autenticación
 */

/**
 * @swagger
 * /api/tenants/register:
 *   post:
 *     summary: Registra una nueva tienda y devuelve un token JWT
 *     tags: [Tenants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storeName
 *               - slug
 *               - adminEmail
 *               - password
 *             properties:
 *               storeName:
 *                 type: string
 *                 example: Mi Tienda Tech
 *               slug:
 *                 type: string
 *                 example: mi-tienda-tech
 *               adminEmail:
 *                 type: string
 *                 example: admin@mitiendatech.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Comercio registrado exitosamente
 *       400:
 *         description: El correo o el slug ya están en uso
 */
router.post('/register', registerTenant);
/**
 * @swagger
 * /api/tenants/login:
 *   post:
 *     summary: Inicia sesión y devuelve un token JWT
 *     tags: [Tenants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adminEmail
 *               - password
 *             properties:
 *               adminEmail:
 *                 type: string
 *                 example: admin@mitiendatech.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', loginTenant);
module.exports = router;