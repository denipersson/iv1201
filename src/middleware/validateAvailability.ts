import { Request, Response, NextFunction } from 'express';
import { findPersonByUsername } from '../dao/personDAO';


/**
 * Validates the availability for adding a request.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response indicating the validation result or passes the error to the error-handling middleware.
 */
export const validateAvailabilityAdd = async (req: Request, res: Response, next: NextFunction) => {
    const { requestedUsername, fromDate, toDate } = req.body;

    // Basic validation for input presence
    if (!requestedUsername || !fromDate || toDate === undefined) {
        return res.status(400).json({ message: "requestedUsername, fromDate, and toDate are required" });
    }

    try {
        const person = await findPersonByUsername(requestedUsername);
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }


        res.locals.personId = person.person_id;
        next();
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
};
