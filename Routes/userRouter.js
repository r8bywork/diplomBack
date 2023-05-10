import {update} from "../Controller/userController.js";
import {Router} from "express";

const router = new Router();

router.put('/:id', update)
export default router;