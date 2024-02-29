import { Request, Response } from 'express';
import { addAvailabilityForPerson } from '../dao/availabilityDAO'

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