import jwt from "jsonwebtoken";
import { secret } from "../config.js";

const authMiddleware = (req, res, next) => {
	if (req.method === "options") {
		next();
	}
	try {
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			return res.status(403).json({ message: "Not authorized" });
		}
		const decodedData = jwt.verify(token, secret);
		req.user = decodedData;
		next();
	} catch (e) {
		console.log(e);
		return res.status(403).json({ message: "Not authorized" });
	}
};

export default authMiddleware;
