import { NextFunction, Request, Response } from "express";
import CustomError from "../../classes/CustomError";
import { MessageResponse } from "../../types/Messages";
import { Species } from "../../types/Species";
import speciesModel from "../models/speciesModel";

type DBMessageResponse = MessageResponse& {
  data: Species | Species[];
}



const postSpecies = async (req: Request<{},{},Species>, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const newSpecies = new speciesModel(req.body);
    const savedSpecies = await newSpecies.save();
    res.json({message: "Species added successfully", data: savedSpecies});

} catch (error) {
  next(new CustomError((error as Error).message, 500));
  }
}

const getSpecies = async (req: Request, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const species = await speciesModel.find();
    res.json({message: "Species fetched successfully", data: species});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}

const getSpecie = async (req: Request<{id: string}>, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const species = await speciesModel.findById(req.params.id);
    if (!species) {
      throw new Error("Species not found");
    }
    res.json({message: "Species fetched successfully", data: species});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}

const putSpecies = async (req: Request<{id: string}, {}, Species>, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const updatedSpecies = await speciesModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!updatedSpecies) {
      throw new Error("Species not found");
    }
    res.json({message: "Species updated successfully", data: updatedSpecies});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}

const deleteSpecies = async (req: Request<{id: string}>, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const deletedSpecies = await speciesModel.findByIdAndDelete(req.params.id);
    if (!deletedSpecies) {
      throw new Error("Species not found");
    }
    res.json({message: "Species deleted successfully", data: deletedSpecies});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}

//http://localhost:3000/api/v1/species/location?topRight=52.82,71.09&bottomLeft=-11.62,34.86
//router.route('/location').get(getSpeciesByLocation);
//Respond to GET /species/location with an array of species located in a box. E.g. GET /species/location?topRight=52.82,71.09&bottomLeft=-11.62,34.86 will return species inside Europe. use /species/location endpoint and ?topRight=lat,lon&bottomLeft=lat,lon to specify the area. If you use other endpoint and/or query parameters, the test will fail.

const getSpeciesByLocation = async (req: Request, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const topRight = req.query.topRight as string;
    const bottomLeft = req.query.bottomLeft as string;
    const topRightArray = topRight.split(',').map(Number);
    const bottomLeftArray = bottomLeft.split(',').map(Number);
    const species = await speciesModel.find({
      'location.coordinates': {
        $geoWithin: {
          $box: [bottomLeftArray, topRightArray]
        }
      }
    });
    res.json({message: "Species fetched successfully", data: species});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}





export {postSpecies, getSpecies, getSpecie, putSpecies, deleteSpecies, getSpeciesByLocation};
