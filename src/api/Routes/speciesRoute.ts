import express from 'express';
import { deleteSpecies, getSpecie, getSpecies, getSpeciesByLocation, postSpecies, putSpecies, findSpeciesInArea } from '../controllers/speciesController';
import { addSpeciesImage } from '../../middlewares';

const router = express.Router();

router.route('/location').get(getSpeciesByLocation);
router.route('/').get(getSpecies).post(addSpeciesImage,postSpecies);
router.route('/area').post(findSpeciesInArea);
router.route('/:id').get(getSpecie).put(putSpecies).delete(deleteSpecies);


export default router;
