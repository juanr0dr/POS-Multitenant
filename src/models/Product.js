const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Drinks', 'Desserts', 'Sides']
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: 0
    },
    stock: {
        type: Number,
        default: 100,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);