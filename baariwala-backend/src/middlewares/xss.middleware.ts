import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

const clean = (data: any): any => {
  if (typeof data === 'string') {
    return xss(data);
  }
  if (Array.isArray(data)) {
    return data.map((item) => clean(item));
  }
  if (typeof data === 'object' && data !== null) {
    const cleanedObject: any = {};
    for (const key in data) {
      cleanedObject[key] = clean(data[key]);
    }
    return cleanedObject;
  }
  return data;
};

export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) req.body = clean(req.body);
  if (req.params) req.params = clean(req.params);
  // Note: req.query is read-only in Express 5 — skipping to avoid crashes
  next();
};
