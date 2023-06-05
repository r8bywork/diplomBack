import bcrypt from "bcrypt";
import User from "../Models/User.js";
import Worker from "../Models/Worker.js";
//good
export const createWorker = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { username, password, roles, name } = req.body;

		const user = await User.findById(id)
			.populate("house")
			.populate("dairy")
			.populate("feedAndAdditives")
			.populate("breakdowns");

		if (!user) {
			return res.status(404).json({ error: "Пользователь не найден" });
		}
		const hashedPassword = await bcrypt.hash(password, 7);
		const worker = new Worker({
			name,
			username,
			password: hashedPassword,
			roles,
			house: user.house,
			dairy: user.dairy,
			feedAndAdditives: user.feedAndAdditives,
			breakdowns: user.breakdowns,
		});

		const savedWorker = await worker.save();

		user.workers.push(savedWorker._id);
		await user.save();

		res.status(200).json({ message: "Рабочий создан!" });
	} catch (error) {
		res.status(500).json({ error: "Ошибка создания рабочего!" });
	}
};

//good
export const updateUser = async (req, res, next) => {
	try {
		const { workerId, ...otherFields } = req.body;

		const worker = await Worker.findById(workerId);
		if (!worker) {
			return res.status(404).json({ error: "Рабочий не найден" });
		}

		// Обновляем поля рабочего
		worker.username = otherFields.username || worker.username;
		worker.name = otherFields.name || worker.name;
		// Если передан новый пароль, зашифруйте его
		if (otherFields.password) {
			const hashedPassword = await bcrypt.hash(otherFields.password, 7);
			worker.password = hashedPassword;
		}

		// Сохраняем изменения
		await worker.save();

		res.status(200).json({ message: "Информация о рабочем успешно обновлена" });
	} catch (error) {
		res.status(500).json({ error: "Ошибка обновления информации о рабочем" });
	}
};

//good
export const getWorkerById = async (req, res, next) => {
	try {
		const { id } = req.params;

		const worker = await Worker.findById(id);

		if (!worker) {
			return res.status(404).json({ error: "Рабочий не найден" });
		}

		res.status(200).json({ worker });
	} catch (error) {
		res.status(500).json({ error: "Ошибка получения информации о рабочем" });
	}
};

// Функция вывода пользователей
//good
export const getUser = async (req, res, next) => {
	try {
		const { id } = req.params;

		const user = await User.findById(id).populate("workers");

		if (!user) {
			return res.status(404).json({ error: "Пользователь не найден" });
		}

		res.status(200).json({ workers: user.workers });
	} catch (error) {
		res.status(500).json({ error: "Ошибка получения пользователей" });
	}
};

// Функция удаления пользователя по ID
//new good
export const deleteUser = async (req, res, next) => {
	try {
		const workerId = req.params.id;

		// Удаление рабочего по ID
		const deletedWorker = await Worker.findByIdAndDelete(workerId);
		console.log(deletedWorker, workerId);
		if (!deletedWorker) {
			return res.status(404).json({ error: "Рабочий не найден" });
		}

		// Удаление ссылки на рабочего из документа User
		const user = await User.findOne({ workers: workerId });

		if (user) {
			user.workers.pull(workerId);
			await user.save();
		}

		res.status(200).json({ message: "Рабочий успешно удален" });
	} catch (error) {
		res.status(500).json({ error: "Ошибка удаления рабочего" });
	}
};

//good
//new good
export const deleteRole = async (req, res, next) => {
	try {
		const { workerId, roleIndex } = req.body;

		const worker = await Worker.findById(workerId);

		if (!worker) {
			return res.status(404).json({ error: "Рабочий не найден" });
		}

		if (roleIndex < 0 || roleIndex >= worker.roles.length) {
			return res.status(400).json({ error: "Недопустимый индекс роли" });
		}

		worker.roles.splice(roleIndex, 1);
		await worker.save();

		res.status(200).json({ message: "Роль успешно удалена у рабочего" });
	} catch (error) {
		res.status(500).json({ error: "Ошибка удаления роли у рабочего" });
	}
};

//new good
export const addRole = async (req, res, next) => {
	try {
		// const { workerId } = req.params;
		const { roles, workerId } = req.body;

		const worker = await Worker.findById(workerId);

		if (!worker) {
			return res.status(404).json({ error: "Рабочий не найден" });
		}

		const newRoles = roles.split(",").map((role) => role.trim());
		worker.roles.push(...newRoles);
		await worker.save();

		res.status(200).json({ message: "Роли успешно добавлены рабочему" });
	} catch (error) {
		res.status(500).json({ error: "Ошибка добавления ролей рабочему" });
	}
};
