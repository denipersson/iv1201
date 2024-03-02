
import jwt from 'jsonwebtoken';

/**
 * Middleware function to validate competency addition.
 * 
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 * @returns A JSON response with an error message if validation fails, or calls the next middleware function.
 */export const validateToken = (token: string): { valid: boolean; decoded?: any } => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false };
  }
};


