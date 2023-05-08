import { Router } from "express";
const router = new Router();
import {create, getAllByExpression, getOne, update} from '../Controller/cow.js'


router.post("/create", create);
router.put('/update/:id', update);
router.get('/getAllByExpression', getAllByExpression);
router.get('/getToday', getOne)
export default router;
