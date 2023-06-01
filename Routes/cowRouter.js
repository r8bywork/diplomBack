import { Router } from "express";
import {
	create,
	getAllByExpression,
	getOne,
	getTodayDairy,
	update,
} from "../Controller/cow.js";
const router = new Router();

router.post("/create", create);
router.put("/update/:id", update);
router.get("/get/:id", getTodayDairy);
router.get("/getToday", getOne);
router.get("/getAllByExpression/:id", getAllByExpression);
export default router;
