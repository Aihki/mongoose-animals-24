import {NextFunction, Request, Response} from 'express';
import {Animal} from '../../types/Animal';
import {MessageResponse} from '../../types/Messages';
import animalModel from '../models/animalModel';
import CustomError from '../../classes/CustomError';

type DBMessageResponse = MessageResponse & {
  data: Animal | Animal[];
};

const postAnimal = async (
  req: Request<{}, {}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const newAnimal = new animalModel(req.body);
    const savedAnimal = await newAnimal.save();
    res.status(201).json({
      message: 'Animal created',
      data: savedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimals = async (
  req: Request,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const animals = await animalModel.find().populate({
      path: 'species',
      populate: {
        path: 'category',
        select: '-__v'
      }
    }).select('-__v');
    res.json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimal = async (
  req: Request<{id: string}>,
  res: Response<Animal>,
  next: NextFunction,
) => {
  try {
    const animal = await animalModel
      .findById(req.params.id)
      .populate({
        path: 'species',
        populate: {
          path: 'category',
          select: '-__v'
        }
      })
      .select('-__v');
    if (!animal) {
      throw new Error('Animal not found');
    }
    res.json(animal);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const putAnimal = async (
  req: Request<{id: string}, {}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const updatedAnimal = await animalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true},
    );
    if (!updatedAnimal) {
      throw new Error('Animal not found');
    }
    res.json({message: 'Animal updated ', data: updatedAnimal});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const deleteAnimal = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const deletedAnimal = await animalModel.findByIdAndDelete(req.params.id);
    if (!deletedAnimal) {
      throw new Error('Animal not found');
    }
    res.json({message: 'Animal deleted', data: deletedAnimal});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimalsByLocation = async (
  req: Request<{}, {}, {}, {topRight: string; bottomLeft: string}>,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const {topRight, bottomLeft} = req.query;
    const animals = await animalModel
      .find({
        location: {
          $geoWithin: {
            $box: [topRight.split(','), bottomLeft.split(',')],
          },
        },
      })
      .populate({
        path: 'species',
        populate: {
          path: 'category',
          select: '-__v'
        }
      })
      .select('-__v');
    res.json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimalsBySpecies = async (
  req: Request<{species_name: string}>,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const animals = await animalModel.findBySpecies(req.params.species_name);
    res.json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {
  postAnimal,
  getAnimals,
  getAnimal,
  putAnimal,
  deleteAnimal,
  getAnimalsByLocation,
  getAnimalsBySpecies,
};
