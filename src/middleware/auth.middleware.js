const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_seguro';

const verifyToken = (req, res, next) => {
    try {
        // Obtener el token del header
        const token = req.headers.authorization?.split(' ')[1] || 
                     req.header('x-auth-token');

        // Verificar si existe el token
        if (!token) {
            return res.status(401).json({ 
                mensaje: 'Acceso denegado. Token no proporcionado' 
            });
        }

        try {
            // Verificar el token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Agregar el userId al request
            req.userId = decoded.userId;
            
            next();
        } catch (error) {
            return res.status(401).json({ 
                mensaje: 'Token inválido o expirado' 
            });
        }
    } catch (error) {
        console.error('Error en autenticación:', error);
        res.status(500).json({ 
            mensaje: 'Error en el servidor durante la autenticación' 
        });
    }
};

module.exports = {
    verifyToken
};