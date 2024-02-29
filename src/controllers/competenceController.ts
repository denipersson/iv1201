import { Request, Response } from 'express';
import {
    findOrCreateCompetence,
    getCompetenciesForPersonByEmail,
    getCompetenciesForPersonByUsername,
    insertCompetenceToPerson,
    addAvailabilityForPerson
} from '../dao/CompetenceDAO'


export const addCompetencyToPerson = async (req: Request, res: Response) => {
    const { competencyName, yearsOfExperience } = req.body;
    const personId = res.locals.personId;

    try {
        if(competencyName == "ticket sales" || competencyName == "lotteries" || competencyName == "roller coaster operation"){
            const competenceId = await findOrCreateCompetence(competencyName);
            const competencyProfile = await insertCompetenceToPerson(personId, competenceId, yearsOfExperience);
            res.status(201).json({
                message: 'Competency added successfully',
                competencyProfileId: competencyProfile.competence_profile_id,
                competenceName: competencyName, 
                competenceId: competenceId,
                personId: personId
            });
        }
        else{
            res.status(400).json({
                message: 'Competency not found. Needs to be ticket sales, lotteries or roller coaster operation.'
            });
        }
        
    } catch (error) {
        console.error('Error adding competency to person:', error);
        res.status(500).json('An error occurred during adding comptency to person');
    }
};
/**
 * Controller for getting all competencies of a specific PID.
 * @param req 
 * @param res 
 */
export const getCompetencies = async (req: Request, res: Response) => {
    const { requestedUsername, email } = req.body;
    //console.log(requestedUsername +  "\n" + email);
    try {
        if (requestedUsername === undefined && email === undefined) {
            throw new Error("No username or email provided");
        }
        if (requestedUsername !== undefined) {
            const compentencies = await getCompetenciesForPersonByUsername(requestedUsername);
            res.status(200).json(compentencies);
        }
        else if (email !== undefined) {
            const compentencies = await getCompetenciesForPersonByEmail(email);
            res.status(200).json(compentencies);
        }

    } catch (error) {
        console.error('Error during applicant retrieval:', error);
        res.status(500).json('An error occurred during applicant retrieval');
    }
};

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

