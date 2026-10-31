const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Obtener el token del header 'Authorization'
    const token = req.header('Authorization');

    // Si no hay token, denegar acceso
    if (!token) return res.status(401).json({ mensaje: 'Acceso denegado. No hay token.' });

    try {
        // 2. Limpiar el token (quitando la palabra 'Bearer ' si viene incluida)
        const tokenLimpio = token.replace('Bearer ', '');
        
        // 3. Verificar que el token sea válido
        const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
        
        // 4. Guardar los datos del usuario en la petición
        req.usuario = verificado;
        
        // 5. Dar luz verde para continuar
        next(); 
    } catch (error) {
        res.status(400).json({ mensaje: 'Token no válido o expirado.' });
    }
};