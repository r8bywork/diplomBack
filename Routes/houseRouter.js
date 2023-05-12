import { Router } from "express";
import {
	addHouse,
	deleteHouse,
	getAllHouses,
	updateHouse,
} from "../Controller/houseContoller.js";

const router = new Router();

// Add a new house
router.post("/add", addHouse);
// Update an existing house
router.put("/update", updateHouse);
// Delete a house
router.delete("/:id", deleteHouse);
// Get all houses
router.get("/", getAllHouses);
export default router;
