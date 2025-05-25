import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

export const sanitizeInputs = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (value: any) =>
    typeof value === 'string'
      ? sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
      : value;

  for (const key in req.body) {
    req.body[key] = sanitize(req.body[key]);
  }

  next();
};
