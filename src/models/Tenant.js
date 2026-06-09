const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: [true, 'El nombre de la tienda es obligatorio'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        description: 'Identificador único para la URL de la tienda (ej. mi-tienda)'
    },
    adminEmail: {
        type: String,
        required: [true, 'El correo del administrador es obligatorio'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un correo válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: 6
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Crea automáticamente los campos createdAt y updatedAt
});

module.exports = mongoose.model('Tenant', tenantSchema);