// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// We need to tell TypeScript that our requests might have a 'user' attached to them now
export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // Check if the request has an authorization header that starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header (looks like: "Bearer eYjhG...xYz")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token using your secret key
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      // 3. Find the user in the database and attach them to the request (but leave out the password!)
      req.user = await User.findById(decoded.id).select('-password');

      // 4. Token is good! Let them into the club
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};