const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrder, updateOrderStatus } = require('../controllers/orderController');
const { protectRoute } = require('../middlewares/authMiddleware');

router.use(protectRoute);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestión de Tickets, Mesas y Ventas (KDS & POS)
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Abre una nueva mesa o registra una venta directa
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tableName
 *               - checkNumber
 *               - items
 *               - totalAmount
 *             properties:
 *               tableName:
 *                 type: string
 *                 example: Table 12
 *               checkNumber:
 *                 type: string
 *                 example: CHK-1045
 *               status:
 *                 type: string
 *                 enum: [Abierta, Pendiente, Pagada, Anulada]
 *                 example: Abierta
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     name:
 *                       type: string
 *                       example: Coca Cola
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 5600
 *                     total:
 *                       type: number
 *                       example: 11200
 *               totalAmount:
 *                 type: number
 *                 example: 11200
 *     responses:
 *       201:
 *         description: Orden o Mesa creada exitosamente
 *   get:
 *     summary: Obtiene el historial completo de ventas y mesas (Todas las ventas)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las órdenes de la tienda obtenida con éxito
 */
router.post('/', createOrder);
router.get('/', getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Actualiza los items de una mesa abierta (Función Save / Send)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden en MongoDB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tableName:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *               totalAmount:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mesa actualizada exitosamente
 */
router.put('/:id', updateOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Actualiza solo el estado de la orden (KDS o Cierre Rápido)
 *     tags: [Orders]
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
 *               status:
 *                 type: string
 *                 enum: [Abierta, Pendiente, Pagada, Anulada]
 *                 example: Pagada
 *     responses:
 *       200:
 *         description: Estado de la orden actualizado
 */
router.put('/:id/status', updateOrderStatus);

module.exports = router;