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
// Get all houses
router.get("/get", getAllHouses);
// Delete a house
router.delete("/:id", deleteHouse);
export default router;
