import { Router } from "express";
import { update } from "../Controller/userController.js";

const router = new Router();

router.put("/:id", update);
export default router;
