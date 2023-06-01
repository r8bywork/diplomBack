import { Router } from "express";
import {
	createWorker,
	deleteUser,
	getUser,
	updateUser,
} from "../Controller/workerController.js";

const router = new Router();

router.put("/update/:id", updateUser);
router.get("/get/:id", getUser);
router.delete("/delete", deleteUser);
router.post("/:id", createWorker);

export default router;
