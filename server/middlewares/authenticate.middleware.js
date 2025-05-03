import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import prisma from '../../src/lib/prisma';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.cookies.token;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) {
    return res.status(201).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.usuario.findUnique({ where: { id: decoded.userId } });

    if (!user) return res.status(201).json({ message: 'Usuario no encontrado' });

    // Guarda el usuario en res.locals para acceso global durante la petición
    res.locals.user = user;
    next();
  } catch (err) {
    return res.status(201).json({ message: 'Token inválido' });
  }
}
