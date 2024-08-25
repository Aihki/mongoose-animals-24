import { NextFunction, Request, Response } from "express";
import { Animal } from "../../types/Animal";
import { MessageResponse } from "../../types/Messages";
import animalModel from "../models/animalModel";
import CustomError from "../../classes/CustomError";

type DBMessageResponse = MessageResponse& {
  data: Animal | Animal[];
}

const postAnimal = async (req: Request<{},{},Animal>, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const newAnimal = new animalModel(req.body);
    const savedAnimal = await newAnimal.save();
    res.json({message: "Animal added successfully", data: savedAnimal});

} catch (error) {
  next(new CustomError((error as Error).message, 500));
  }
}


const getAnimals = async (req: Request, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const animals = await animalModel.find();
    res.json({message: "Animals fetched successfully", data: animals});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}


const getAnimal = async (req: Request<{id: string}>, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const animal = await animalModel.findById(req.params.id);
    if (!animal) {
      throw new Error("Animal not found");
    }
    res.json({message: "Animal fetched successfully", data: animal});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}


const putAnimal = async (req: Request<{id: string}, {}, Animal>, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const updatedAnimal = await animalModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!updatedAnimal) {
      throw new Error("Animal not found");
    }
    res.json({message: "Animal updated successfully", data: updatedAnimal});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}


const deleteAnimal = async (req: Request<{id: string}>, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const deletedAnimal = await animalModel.findByIdAndDelete(req.params.id);
    if (!deletedAnimal) {
      throw new Error("Animal not found");
    }
    res.json({message: "Animal deleted successfully", data: deletedAnimal});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}

//http://localhost:3000/api/v1/animals/location?topRight=52.82,71.09&bottomLeft=-11.62,34.86
//router.route('/location').get(getAnimalsByLocation);
//Respond to GET /species/location with an array of species located in a box. E.g. GET /species/location?topRight=52.82,71.09&bottomLeft=-11.62,34.86 will return species inside Europe. use /species/location endpoint and ?topRight=lat,lon&bottomLeft=lat,lon to specify the area. If you use other endpoint and/or query parameters, the test will fail.

const getAnimalsByLocation = async (req: Request, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const topRight = req.query.topRight as string;
    const bottomLeft = req.query.bottomLeft as string;
    const topRightArray = topRight.split(',').map(Number);
    const bottomLeftArray = bottomLeft.split(',').map(Number);
    const animals = await animalModel.find({
      'location.coordinates': {
        $geoWithin: {
          $box: [bottomLeftArray, topRightArray]
        }
      }
    });
    res.json({message: "Animals fetched successfully", data: animals});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}



export {postAnimal, getAnimals, getAnimal, putAnimal, deleteAnimal, getAnimalsByLocation};
