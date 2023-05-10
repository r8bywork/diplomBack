import { Router } from "express";
import {
	find,
	getByExpression,
	getOne,
	remove,
	update,
} from "../Controller/feedAndAddivitivesController.js";
const router = new Router();

router.post("/update", update);
router.get("/find", find);
router.get("/", getByExpression);
router.delete("/:id/", remove);
router.get("/:id", getOne);

export default router;
