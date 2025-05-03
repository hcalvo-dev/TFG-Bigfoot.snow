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

  const existUser = await prisma.usuario.findUnique({
    where: { email }
  });

  if (existUser) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }
  // Validar el formato del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Formato de email inválido' });
  }

  // Validar la longitud del nombre
  if (name.length < 3) {
    return res.status(400).json({ message: 'El nombre debe tener al menos 3 caracteres' });
  }
  // Validar el formato de la contraseña
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.\-_*:;])[a-zA-Z\d.\-_*:;]{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Formato de contraseña inválido' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const rol = await prisma.rol.findUnique({
    where: { nombre: 'user' },
  });

  const user = await prisma.usuario.create({
    data: { nombre: name, email, password: hashedPassword, rolId: rol.id },
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email , rol: rol.nombre},
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  // Enviar el token como cookie httpOnly
  res
    .cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' })
    .status(201)
    .json({ message: 'Usuario registrado correctamente', token });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.usuario.findUnique({
    where: { email }
  });

  const rol = await prisma.rol.findUnique({
    where: { id: user.rolId }
  });

  if (!user) {
    return res.status(400).json({ message: 'Usuario no encontrado' });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  const secret = JWT_SECRET;

  if (!secret) {
    throw new Error('Falta la variable de entorno JWT_SECRET');
  }

   // Crear el token con un secreto y duración
   const token = jwt.sign(
    { userId: user.id, email: user.email , rol: rol.nombre },
    secret,
    { expiresIn: '2h' }
  );

  // Enviar el token como cookie httpOnly
  res
    .cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' })
    .json({ message: 'Login correcto', token });
};