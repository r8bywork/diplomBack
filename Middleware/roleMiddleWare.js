import jwt from "jsonwebtoken";
import { secret } from "../config.js";

const roleMiddleWare = (roles) => {
	return function (req, res, next) {
		if (req.method === "options") {
			next();
		}
		try {
			const token = req.headers.authorization.split(" ")[1];
			if (!token) {
				return res.status(403).json({ message: "Not authorized" });
			}
			const { roles: userRoles } = jwt.verify(token, secret);
			let hasRole = false;
			userRoles.forEach((role) => {
				if (roles.includes(role)) {
					hasRole = true;
				}
			});
			if (!hasRole) {
				return res.status(403).json({ message: "Access denied" });
			}
			next();
		} catch (e) {
			console.log(e);
			return res.status(403).json({ message: "Not authorized" });
		}
	};
};

export default roleMiddleWare;
