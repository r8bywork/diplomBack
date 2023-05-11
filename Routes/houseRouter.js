import { Router } from "express";
import {
	addHouse,
	deleteHouse,
	updateHouse,
} from "../Controller/houseContoller.js";

const router = new Router();

// Add a new house
router.post("/add", addHouse);
// Update an existing house
router.put("/:id", updateHouse);
// Delete a house
router.delete("/:id", deleteHouse);

export default router;
