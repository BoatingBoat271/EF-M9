const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'kanbanpro_secret_sprint3';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      ok: false,
      message: 'Token no proporcionado'
    });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      ok: false,
      message: 'Formato de Authorization invalido. Usa Bearer token'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({
      ok: false,
      message: 'Token invalido o expirado'
    });
  }
}

module.exports = authMiddleware;
