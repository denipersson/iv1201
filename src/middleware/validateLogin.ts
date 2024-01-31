import { Request, Response, NextFunction } from 'express';

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    // Validera req.body (användaruppgifter)
    // Om validering misslyckas, skicka ett felmeddelande:
    // res.status(400).json({ message: "Valideringsfel" });

    // Om allt är OK, fortsätt till nästa middleware/controller
    next();
};
