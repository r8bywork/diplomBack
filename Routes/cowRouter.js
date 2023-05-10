import { Router } from "express";
import {
	create,
	getAllByExpression,
	getOne,
	update,
} from "../Controller/cow.js";
const router = new Router();

router.post("/create", create);
router.put("/update/:id", update);
router.get("/getAllByExpression", getAllByExpression);
router.get("/getToday", getOne);
export default router;
