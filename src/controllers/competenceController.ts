import { Request, Response } from 'express';
import { findOrCreateCompetence, getCompetenciesForPersonByUsername, insertCompetenceToPerson } from '../dao/CompetenceDAO'


export const addCompetencyToPerson = async (req: Request, res: Response) => {
    const { competencyName, yearsOfExperience } = req.body;
    const personId = res.locals.personId;

    try {
        const competenceId = await findOrCreateCompetence(competencyName);
        const competencyProfile = await insertCompetenceToPerson(personId, competenceId, yearsOfExperience);
        res.status(201).json({
            message: 'Competency added successfully',
            competencyProfileId: competencyProfile.competence_profile_id,
            competenceName: competencyName, 
            competenceId: competenceId,
            personId: personId
        });
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
    const { requestedUsername } = req.body;
   
    try {
        const compentencies = await getCompetenciesForPersonByUsername(requestedUsername);
        res.status(200).json(compentencies);
    } catch (error) {
        console.error('Error during applicant retrieval:', error);
        res.status(500).json('An error occurred during applicant retrieval');
    }
};