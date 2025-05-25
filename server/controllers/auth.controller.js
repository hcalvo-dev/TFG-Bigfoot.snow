import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/lib/prisma';
import { JWT_SECRET } from '../config';

export const registerUser = async (req, res) => {
  const { email, password, name, confirmPassword } = req.body;

  if (!email || !password || !name || !confirmPassword) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Formato de email inválido' });
  }

  if (name.length < 3) {
    return res.status(400).json({ message: 'El nombre debe tener al menos 3 caracteres' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.\-_*:;])[a-zA-Z\d.\-_*:;]{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Formato de contraseña inválido' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const rol = await prisma.rol.findUnique({
    where: { nombre: 'user' },
  });

  const existUser = await prisma.usuario.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
  });

  if (existUser) {
    if (existUser.estadoCuenta === false) {
      // Reactivar usuario existente
      const updatedUser = await prisma.usuario.update({
        where: { id: existUser.id },
        data: {
          nombre: name,
          password: hashedPassword,
          estadoCuenta: true,
        },
      });

      const rolExistente = await prisma.rol.findUnique({
        where: { id: updatedUser.rolId },
      });

      const token = jwt.sign(
        { userId: updatedUser.id, email: updatedUser.email, rol: rolExistente.nombre },
        JWT_SECRET,
        { expiresIn: '12h' }
      );

      return res
        .cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' })
        .status(200)
        .json({ message: 'Cuenta reactivada correctamente', token });
    } else {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
  }

  // Crear nuevo usuario
  const user = await prisma.usuario.create({
    data: {
      nombre: name,
      email,
      password: hashedPassword,
      rolId: rol.id,
      estadoCuenta: true,
    },
  });

  const token = jwt.sign({ userId: user.id, email: user.email, rol: rol.nombre }, JWT_SECRET, {
    expiresIn: '3h',
  });

  res
    .cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' })
    .status(201)
    .json({ message: 'Usuario registrado correctamente', token });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.usuario.findFirst({
    where: {
      email: {
        equals: email,
        mode: 'insensitive',
      },
      estadoCuenta: true,
    },
  });

  if (!user) {
    return res.status(400).json({ message: 'Usuario/contraseña incorrecta' });
  }

  const rol = await prisma.rol.findUnique({
    where: { id: user.rolId },
  });

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: 'Usuario/contraseña incorrecta' });
  }

  const secret = JWT_SECRET;

  if (!secret) {
    throw new Error('Falta la variable de entorno JWT_SECRET');
  }

  // Crear el token con un secreto y duración
  const token = jwt.sign({ userId: user.id, email: user.email, rol: rol.nombre }, secret, {
    expiresIn: '12h',
  });

  // Enviar el token como cookie httpOnly
  res
    .cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' })
    .json({ message: 'Login correcto', token });
};
