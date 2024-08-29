import express from 'express';
import { deleteCategory, getCategories, getCategory, postCategory, putCategory } from '../controllers/catogoryController';

const router = express.Router();

router.route('/').post(postCategory).get(getCategories);
router.route('/:id').get(getCategory).put(putCategory).delete(deleteCategory);


export default router;
