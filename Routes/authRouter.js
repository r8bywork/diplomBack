import { Router } from "express";
import { check } from "express-validator";
import {
	getUser,
	getUserInfo,
	getUsers,
	login,
	register,
} from "../Controller/authController.js";
import roleMiddleWare from "../Middleware/roleMiddleWare.js";
const router = new Router();

router.post(
	"/register",
	[
		check("username", "This field can not be empty").notEmpty(),
		check("password", "This field can not be empty").isLength({
			min: 4,
			max: 16,
		}),
	],
	register
);
router.post("/login", login);
router.get("/users", roleMiddleWare(["admin"]), getUsers);
router.get("/findUser/", getUserInfo);
router.get("/get", getUser, (req, res) => {
	res.json({
		message: "You have access to this protected route!",
		user: req.user,
	});
});

export default router;
