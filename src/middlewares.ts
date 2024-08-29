import {NextFunction, Request, Response} from 'express';
import CustomError from './classes/CustomError';
import {ErrorResponse} from './types/Messages';
import { Species } from './types/Species';
import getWikiImage from './utils/getWikiImage';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // console.log('errorhanler', err);
  const statusCode = err.status !== 200 ? err.status || 500 : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const addSpeciesImage = async (req: Request<{},{}, Species>, res: Response, next: NextFunction) => {
  try {
    const {species_name} = req.body;
    const image =  await getWikiImage(species_name);
    req.body.image = image;
    next();
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}


export {notFound, errorHandler, addSpeciesImage};
