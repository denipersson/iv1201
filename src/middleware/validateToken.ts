import jwt from 'jsonwebtoken';
import { getUserFromToken } from '../helpers/token';

// Function to validate a token - this will be used in a middleware to protect routes that require a valid session
export const validateToken = (token: string): { valid: boolean; decoded?: any } => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false };
  }
};


