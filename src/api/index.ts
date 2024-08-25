import express, {Request, Response} from 'express';
import {MessageResponse} from '../types/Messages';
import categoryRoute from './Routes/categoryRoute';
import speciesRoute from './Routes/speciesRoute';
import animalRoute from './Routes/animalRoute';

const router = express.Router();

router.get<{}, MessageResponse>('/', (_req: Request, res: Response) => {
  res.json({
    message: 'api v1',
  });
});

router.use('/categories', categoryRoute);
router.use('/species', speciesRoute);
router.use('/animals', animalRoute);


export default router;
