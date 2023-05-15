import { Router } from "express";
import {
	changeFeed,
	find,
	getByExpression,
	getOne,
	remove,
	update,
} from "../Controller/feedAndAddivitivesController.js";
const router = new Router();

router.post("/update", update);
router.put("/change", changeFeed);
router.get("/find", find);
router.get("/", getByExpression);
router.delete("/:id/", remove);
router.get("/:id", getOne);

export default router;
