import { Router } from "express";
import {
	changeFeed,
	find,
	remove,
	update,
} from "../Controller/feedAndAddivitivesController.js";
const router = new Router();

// router.post("/update", update);
router.post("/update", update);
router.put("/change", changeFeed);
router.get("/find", find);
router.delete("/:id/", remove);

export default router;
