import { Request, Response } from 'express';
import { addAvailabilityForPerson, getAvailabilityForPersonByUsername } from '../dao/availabilityDAO'

/**
 * Adds availability for a person.
 * @param req - The request object.
 * @param res - The response object.
 */
export const addAvailability = async (req: Request, res: Response) => {
    const { fromDate, toDate } = req.body;
    const personId = res.locals.personId;

    try {
        await addAvailabilityForPerson(personId, fromDate, toDate);
        res.status(200).json({
            message: "Availability added successfully",
            fromDate: fromDate,
            toDate: toDate,
            personId: personId
        });
    } catch (error) {
        console.error('Error during applicant retrieval:', error);
        res.status(500).json('An error occurred during adding availability');
    }
};

/**
 * Retrieves availability for a person by username.
 * @param req - The request object.
 * @param res - The response object.
 */
export const getAvailability = async (req: Request, res: Response) => {
    const { username } = req.body;

    try {
        if (username === undefined) {
            throw new Error("No personId provided");
        }

        const availability = await getAvailabilityForPersonByUsername(username);
        res.status(200).json(availability);

    } catch (error) {
        console.error('Error during availability retrieval:', error);
        res.status(500).json('An error occurred during availability retrieval');
    }
};
