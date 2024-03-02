
import { Request, Response, NextFunction } from 'express';
import { findPersonByUsername } from '../dao/personDAO';

/**
 * Middleware function to validate competency addition.
 * 
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 * @returns A JSON response with an error message if validation fails, or calls the next middleware function.
 */
export const validateCompetencyAdd = async (req: Request, res: Response, next: NextFunction) => {
    const { requestedUsername, competencyName, yearsOfExperience } = req.body;

    // Basic validation for input presence
    if (!requestedUsername || !competencyName || yearsOfExperience === undefined) {
        return res.status(400).json({ message: "requestedUsername, competencyName, and yearsOfExperienceare required" });
    }

    // Additional validations can be added here, maybe yearsOfExperience is number?
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
