const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer <TOKEN>

    if (!token) {
        return res.status(401).json({
            success: false,
            code: 'TOKEN_MISSING',
            message: 'Acceso denegado. No se proporcionó un token de autenticación.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guarda los datos del usuario (id, email, role) en la petición
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            code: 'TOKEN_INVALID',
            message: 'El token es inválido o ha expirado.'
        });
    }
};

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            code: 'UNAUTHORIZED_ROLE',
            message: 'Acceso restringido solo para administradores.'
        });
    }
};

module.exports = {
    verifyToken,
    verifyAdmin
};