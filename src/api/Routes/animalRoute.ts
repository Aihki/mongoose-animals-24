import express from 'express';
import { deleteAnimal, getAnimal, getAnimals, getAnimalsByLocation, postAnimal, putAnimal,getAnimalsBySpecies } from '../controllers/animalController';

const router = express.Router();


router.route('/location').get(getAnimalsByLocation);
router.route('/').post(postAnimal).get(getAnimals);
router.route('/species/:species').get(getAnimalsBySpecies);
router.route('/:id').get(getAnimal).put(putAnimal).delete(deleteAnimal);


export default router;
