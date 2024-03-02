import { Request, Response, NextFunction } from 'express';
import { findPersonByUsername } from '../dao/personDAO';


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
