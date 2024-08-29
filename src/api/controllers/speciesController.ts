import { NextFunction, Request, Response } from "express";
import CustomError from "../../classes/CustomError";
import { MessageResponse } from "../../types/Messages";
import { Species } from "../../types/Species";
import speciesModel from "../models/speciesModel";
import geojsonValidation from "geojson-validation";

type DBMessageResponse = MessageResponse & {
  data: Species | Species[];
};

const postSpecies = async (req: Request<{}, {}, Species>, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const newSpecies = new speciesModel(req.body);
    const savedSpecies = await newSpecies.save();
    res.status(201).json({
      message: 'Species created',
      data: savedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getSpecies = async (req: Request, res: Response<Species[]>, next: NextFunction) => {
  try {
    const species = await speciesModel.find().populate('category').select('-__v');
    res.json( species );
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getSpecie = async (req: Request<{ id: string }>, res: Response<Species>, next: NextFunction) => {
  try {
    const species = await speciesModel.findById(req.params.id).populate('category').select('-__v');
    if (!species) {
      throw new Error("Species not found");
    }
    res.json( species );
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const putSpecies = async (req: Request<{ id: string }, {}, Species>, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const updatedSpecies = await speciesModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSpecies) {
      throw new Error("Species not found");
    }
    res.json({ message: "Species updated", data: updatedSpecies });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const deleteSpecies = async (req: Request<{ id: string }>, res: Response<DBMessageResponse>, next: NextFunction) => {
  try {
    const deletedSpecies = await speciesModel.findByIdAndDelete(req.params.id);
    if (!deletedSpecies) {
      throw new Error("Species not found");
    }
    res.json({ message: "Species deleted", data: deletedSpecies });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getSpeciesByLocation = async (req: Request<{},{},{},{topRight: string, bottomLeft: string}>, res: Response<Species[]>, next: NextFunction) => {
  try {
    const {topRight,bottomLeft} = req.query;
    const species = await speciesModel.find({
      location: {
        $geoWithin: {
          $box: [topRight.split(','), bottomLeft.split(',')]
        }
      }
    }).populate('category').select('-__v');
    res.json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const findSpeciesInArea = async (
  req: Request,
  res: Response<Species[]>,
  next: NextFunction
) => {
  try {
    const polygon = req.body.polygon || req.body;

    if (!polygon || !geojsonValidation.isPolygon(polygon)) {
      throw new CustomError('Invalid GeoJSON polygon provided', 400);
    }

    const speciesInArea = await speciesModel.findByArea(polygon);

    if (!speciesInArea || speciesInArea.length === 0) {
      throw new CustomError('No species found in the specified area', 404);
    }
    res.status(200).json(speciesInArea);
  } catch (error) {
    console.error('Error in findSpeciesInArea:', error);
    next(new CustomError((error as Error).message, 500));
  }
};
export { postSpecies, getSpecies, getSpecie, putSpecies, deleteSpecies, getSpeciesByLocation, findSpeciesInArea };
