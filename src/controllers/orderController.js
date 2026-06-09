const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    try {
        const { tableName, checkNumber, items, totalAmount, status } = req.body;

        const newOrder = new Order({
            tenantId: req.tenant.tenantId,
            tableName,
            checkNumber,
            items,
            totalAmount,
            status: status || 'Abierta'
        });

        await newOrder.save();

        if (status === 'Pagada') {
            for (let item of items) {
                await Product.findOneAndUpdate(
                    { _id: item.productId, tenantId: req.tenant.tenantId },
                    { $inc: { stock: -item.quantity } }
                );
            }
        }

        res.status(201).json({ message: 'Orden creada', order: newOrder });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear', details: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ tenantId: req.tenant.tenantId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener', details: error.message });
    }
};

// NUEVO: Función para actualizar toda la orden sin crear una nueva (El botón "Save")
exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenant.tenantId },
            req.body,
            { new: true }
        );

        if (!updatedOrder) return res.status(404).json({ error: 'Orden no encontrada' });

        // Si la actualizamos a Pagada, descontamos stock
        if (req.body.status === 'Pagada') {
            for (let item of req.body.items) {
                await Product.findOneAndUpdate(
                    { _id: item.productId, tenantId: req.tenant.tenantId },
                    { $inc: { stock: -item.quantity } }
                );
            }
        }

        res.status(200).json({ message: 'Orden actualizada', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar', details: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenant.tenantId },
            { status },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estado', details: error.message });
    }
};