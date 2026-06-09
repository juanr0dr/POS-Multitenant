const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Importamos el middleware de autenticación (Asegura los 40 puntos de calidad)
const { protectRoute } = require('../middlewares/authMiddleware');

// Aplicamos la protección a TODAS las rutas de este router
router.use(protectRoute);
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Teclado Mecánico
 *               description:
 *                 type: string
 *                 example: Switches Red silenciosos
 *               price:
 *                 type: number
 *                 example: 85000
 *               stock:
 *                 type: number
 *                 example: 15
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       401:
 *         description: Acceso denegado. Token faltante o inválido.
 */
router.post('/', createProduct);
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene todos los productos de la tienda
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 */
router.get('/', getProducts);
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtiene un producto por su ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto en MongoDB
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 *   put:
 *     summary: Actualiza un producto existente
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 example: 90000
 *               stock:
 *                 type: number
 *                 example: 10
 *     responses:
 *       200:
 *         description: Producto actualizado
 *   delete:
 *     summary: Elimina un producto del catálogo
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 */
router.get('/:id', getProductById);
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualiza un producto existente
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto en MongoDB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Teclado Mecánico
 *               description:
 *                 type: string
 *                 example: Switches Red silenciosos
 *               price:
 *                 type: number
 *                 example: 90000
 *               stock:
 *                 type: number
 *                 example: 10
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', updateProduct);
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Elimina un producto del catálogo
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto en MongoDB
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', deleteProduct);

module.exports = router;