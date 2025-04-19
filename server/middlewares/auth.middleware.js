import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // authHeader debe tener formato: "Bearer eyJhbGciOi..."
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}
