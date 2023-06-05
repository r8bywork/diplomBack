import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import Role from "../Models/Role.js";
import User from "../Models/User.js";
import Worker from "../Models/Worker.js";
import { secret } from "../config.js";

const generateAccessToken = (id, roles) => {
	const payload = {
		id,
		roles,
	};
	return jwt.sign(payload, secret, { expiresIn: "24h" });
};

export const register = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ message: "Ошибка в процессе регистрации", errors });
		}
		//Деструктуризация для получения логина и пароль
		const { username, password, email, phoneNumber, organizationName } =
			req.body;
		//Находим пользователя с таким никнеймом
		const candidate = await User.findOne({ username });
		//Проверяем существует ли пользователь, если существует то выдаем сообщение пользователю
		if (candidate) {
			return res.status(401).json({ message: "Польз. существует" });
		}

		//Создаем hash пароль использую соль
		const hashPassword = bcrypt.hashSync(password, 7);
		// Находим роль "пользователь"
		const userRole = await Role.findOne({ value: "user" });
		//Создаем нового пользователя
		const user = new User({
			username,
			password: hashPassword,
			email,
			phoneNumber,
			organizationName,
			roles: ["admin"],
		});
		//Сохраняем его
		await user.save();
		//Выдаем сообщение о успешной регистрации
		return res.json({ message: "Успешно" });
	} catch (e) {
		//Иначе выкидываем ошибку
		// console.log(e);
		res.status(400).json({ message: "Ошибка" });
	}
};

// export const login = async (req, res) => {
// 	try {
// 		const { username, password } = req.body;
// 		const user = await User.findOne({ username });
// 		if (!user) {
// 			return res.status(400).json({ message: "Can't find username" });
// 		}
// 		const validPassword = bcrypt.compareSync(password, user.password);
// 		if (!validPassword) {
// 			return res.status(400).json({ message: "Invalid password" });
// 		}
// 		const token = generateAccessToken(user._id, user.roles);
// 		return res.json({ token });
// 	} catch (e) {
// 		console.log(e);
// 		res.status(400).json({ message: "Login error" });
// 	}
// };

// export const login = async (req, res) => {
// 	try {
// 		const { username, password } = req.body;

// 		// Check if the username belongs to a user
// 		const user = await User.findOne({ username });
// 		if (user) {
// 			// User authentication
// 			const validPassword = bcrypt.compareSync(password, user.password);
// 			if (!validPassword) {
// 				return res.status(401).json({ message: "Invalid password" });
// 			}
// 			const token = generateAccessToken(user._id, user.roles);
// 			return res.json({ token });
// 		}

// 		// If the username doesn't belong to a user, check if it belongs to a worker
// 		const worker = await Worker.findOne({ "workers.username": username });
// 		if (!worker) {
// 			return res.status(400).json({ message: "Can't find username" });
// 		}

// 		// Worker authentication
// 		const workerData = worker.workers.find((w) => w.username === username);
// 		const validPassword = bcrypt.compareSync(password, workerData.password);
// 		if (!validPassword) {
// 			return res.status(401).json({ message: "Invalid password" });
// 		}
// 		const token = generateAccessToken(worker._id, workerData.roles);
// 		return res.json({ token });
// 	} catch (e) {
// 		console.log(e);
// 		res.status(400).json({ message: "Login error" });
// 	}
// };

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Check if the username belongs to a user
		const user = await User.findOne({ username });
		if (user) {
			// User authentication
			const validPassword = bcrypt.compareSync(password, user.password);
			if (!validPassword) {
				return res.status(401).json({ message: "Invalid password" });
			}
			const token = generateAccessToken(user._id, user.roles);
			return res.json({ token });
		}

		// If the username doesn't belong to a user, check if it belongs to a worker
		const worker = await Worker.findOne({ username });
		if (!worker) {
			return res.status(400).json({ message: "Can't find username" });
		}

		// Worker authentication
		const validPassword = bcrypt.compareSync(password, worker.password);
		if (!validPassword) {
			return res.status(401).json({ message: "Invalid password" });
		}
		const token = generateAccessToken(worker._id, worker.roles);
		return res.json({ token });
	} catch (e) {
		console.log(e);
		res.status(400).json({ message: "Login error" });
	}
};

export const getUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (e) {
		console.log(e);
		res.status(400).json({ message: "Get users error" });
	}
};

export const getUserInfo = async (req, res) => {
	const token = req.headers.authorization.split(" ")[1];
	try {
		const decodedToken = jwt.verify(token, secret);
		console.log("decoded ", decodedToken);
		return res.json(decodedToken.roles);
		// const user = await User.findById(decodedToken.roles).populate("roles");
		// console.log(user);
		// if (!user) {
		// 	return res.status(404).json({ message: "User not found" });
		// }
		// return res.json({ user });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ message: "Unauthorized" });
	}
};

// export const getUser = async (req, res, next) => {
// 	const authHeader = req.headers.authorization;
// 	if (authHeader && authHeader.startsWith("Bearer ")) {
// 		const token = authHeader.split(" ")[1];
// 		const decoded = jwt.verify(token, secret);
// 		console.log(decoded);
// 		const user = await User.findById(decoded.id);
// 		if (!user) {
// 			return res.status(401).json({ message: "Invalid token" });
// 		}
// 		req.user = user;
// 		next();
// 	} else {
// 		return res.status(401).json({ message: "No token provided" });
// 	}
// };

export const getUser = async (req, res, next) => {
	console.clear();
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith("Bearer ")) {
		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, secret);
		console.log(decoded);
		const user = await User.findById(decoded.id);
		// const worker = await Worker.findById(decoded.id); // Добавляем поиск рабочего по ID
		const worker = await Worker.findById(decoded.id)
			.select("username roles house dairy feedAndAdditives")
			.populate(["house", "dairy", "feedAndAdditives"]);
		console.log(decoded.id);
		if (!user && !worker) {
			return res.status(401).json({ message: "Invalid token" });
		}

		// Если пользователь является рабочим, устанавливаем его в req.worker
		if (worker) {
			req.worker = worker;
		} else {
			req.user = user;
		}

		next();
	} else {
		return res.status(401).json({ message: "No token provided" });
	}
};
