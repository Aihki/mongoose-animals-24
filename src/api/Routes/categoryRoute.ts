import express from 'express';
import { deleteCategory, getCategories, getCategory, postCatogory, putCategory } from '../controllers/catogoryController';

const router = express.Router();

router.route('/').post(postCatogory).get(getCategories);
router.route('/:id').get(getCategory).put(putCategory).delete(deleteCategory);


export default router;
