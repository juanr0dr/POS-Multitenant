const jwt = require('jsonwebtoken');

exports.protectRoute = (req, res, next) => {
    let token;

    // Verificar si el token viene en los headers (Authorization: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Se requiere un token de autenticación.' });
    }

    try {
        // Desencriptar el token para sacar el tenantId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adjuntamos los datos del comercio a la petición (req)
        req.tenant = decoded;

        // Pasamos al siguiente controlador
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};