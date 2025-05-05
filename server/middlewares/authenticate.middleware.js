import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import prisma from '../../src/lib/prisma';

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      select: { id: true, nombre: true, email: true, rolId: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Error interno en autenticación' });
  }
};
