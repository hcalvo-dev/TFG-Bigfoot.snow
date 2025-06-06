import { Request, Response, NextFunction } from 'express';

export function capitalizeNombre(req: Request, _res: Response, next: NextFunction) {

  if (typeof req.body?.nombre === 'string') {
    req.body.nombre = req.body.nombre
      .toLowerCase()
      .split(' ')
      .map((palabra: string) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  }
  if (typeof req.body?.name === 'string') {
    req.body.name = req.body.name
      .toLowerCase()
      .split(' ')
      .map((palabra: string) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  }

  next();
}
