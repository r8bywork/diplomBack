import { Router } from "express";
import {
	addRole,
	createWorker,
	deleteRole,
	deleteUser,
	getUser,
	getWorkerById,
	updateUser,
} from "../Controller/workerController.js";

const router = new Router();

router.put("/update", updateUser);
router.get("/get/:id", getUser);
router.get("/getOne", getWorkerById);
router.delete("/delete", deleteUser);
router.post("/:id", createWorker);
router.delete("/deleteRole", deleteRole);
router.put("/addRole", addRole);

export default router;
