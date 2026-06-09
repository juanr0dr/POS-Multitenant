const Tenant = require('../models/Tenant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerTenant = async (req, res) => {
    try {
        const { storeName, slug, adminEmail, password } = req.body;

        // 1. Verificar si el correo o el slug ya existen
        const existingTenant = await Tenant.findOne({ $or: [{ adminEmail }, { slug }] });
        if (existingTenant) {
            return res.status(400).json({ error: 'El correo o el slug de la tienda ya están en uso.' });
        }

        // 2. Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Crear el nuevo Tenant (Comercio)
        const newTenant = new Tenant({
            storeName,
            slug,
            adminEmail,
            password: hashedPassword
        });

        await newTenant.save();

        // 4. Generar el Token JWT
        const payload = {
            tenantId: newTenant._id,
            role: 'admin'
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        // 5. Responder al cliente
        res.status(201).json({
            message: 'Comercio registrado exitosamente',
            token: token,
            tenant: {
                id: newTenant._id,
                storeName: newTenant.storeName,
                slug: newTenant.slug
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor', details: error.message });
    }
};

exports.loginTenant = async (req, res) => {
    try {
        const { adminEmail, password } = req.body;

        // 1. Buscar el tenant por email
        const tenant = await Tenant.findOne({ adminEmail });
        if (!tenant) {
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }

        // 2. Verificar la contraseña
        const isMatch = await bcrypt.compare(password, tenant.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }

        // 3. Generar el Token JWT
        const payload = {
            tenantId: tenant._id,
            role: 'admin'
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        // 4. Responder al cliente
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token: token,
            tenant: {
                id: tenant._id,
                storeName: tenant.storeName,
                slug: tenant.slug
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor', details: error.message });
    }
};