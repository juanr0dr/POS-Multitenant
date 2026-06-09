const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    tableName: { type: String, required: true },
    checkNumber: { type: String, required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        total: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true, min: 0 },
    // 'Abierta' = Rojo, 'Pendiente' = Amarillo, 'Pagada' = Desaparece del mapa
    status: { type: String, enum: ['Abierta', 'Pendiente', 'Pagada', 'Anulada'], default: 'Abierta' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);