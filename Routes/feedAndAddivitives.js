import { Router } from "express";
const router = new Router();
import {create, getByExpression, getOne, remove, update} from '../Controller/feedAndAddivitivesController.js'


router.post("/create", create);
router.get('/', getByExpression);
router.put('/update/:id', update);
router.get('/:id', getOne);
router.delete('/:id', remove);
export default router;
