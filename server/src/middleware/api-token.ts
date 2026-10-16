import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { NotAuthenticated } from '@feathersjs/errors';

const hash = (value: string) => crypto.createHash('sha256').update(value).digest();

const getRequestToken = (req: Request): string | undefined => {
  const match = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '');
  if (match) {
    return match[1].trim();
  }
  // Fallback for clients that can't set headers, e.g. a browser opening a `redirect=true` link
  const token = (req.body && req.body.token) || req.query.token;
  return typeof token === 'string' ? token : undefined;
};

// When no API token is configured, every request is allowed through, as before.
export default (apiToken?: string) => {
  const expected = apiToken && apiToken.trim();

  return (req: Request, res: Response, next: NextFunction) => {
    if (!expected) {
      next();
      return;
    }

    const token = getRequestToken(req);
    // Compare hashes so timingSafeEqual gets equal-length buffers
    if (token && crypto.timingSafeEqual(hash(token), hash(expected))) {
      next();
      return;
    }

    const error = new NotAuthenticated('Invalid or missing API token');
    res.status(error.code).json(error.toJSON());
  };
};
