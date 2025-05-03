import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../server/config';

export function checkSession(request: Request): {
  isLogged: boolean;
  userId?: string;
  email?: string;
  rol?: string;
} {
  const rawCookies = request.headers.get('cookie') || '';
  const cookies = parse(rawCookies);
  const token = cookies.token;

  if (!token) return { isLogged: false };

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      rol: string;
    };

    return {
      isLogged: true,
      userId: decoded.userId,
      email: decoded.email,
      rol: decoded.rol,
    };
  } catch {
    return { isLogged: false };
  }
}
