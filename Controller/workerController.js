import bcrypt from "bcrypt";
import User from "../Models/User.js";
import Worker from "../Models/Worker.js";
//good
export const createWorker = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { username, password, roles, name } = req.body.worker[0];
		// console.log(username, password, roles);

		const user = await User.findById(id)
			.populate("house")
			.populate("dairy")
			.populate("feedAndAdditives");

		if (!user) {
			return res.status(404).json({ error: "Пользователь не найден" });
		}

		const workerDocId = user.workers;

		//Создаем hash пароль использую соль
		const hashPassword = bcrypt.hashSync(password, 7);
		if (!workerDocId) {
			// If the worker document doesn't exist, create a new document and add the worker details
			const newWorkerDoc = new Worker({
				workers: [
					{
						name,
						username,
						password: hashPassword,
						roles,
					},
				],
				house: user.house,
				dairy: user.dairy,
				feedAndAdditives: user.feedAndAdditives,
			});

			// Save the new worker document
			const savedWorkerDoc = await newWorkerDoc.save();

			// Update the workers field in the user document with the new worker document's ID
			user.workers = savedWorkerDoc._id;
			console.log(savedWorkerDoc._id);
		} else {
			// If the worker document exists, retrieve the document and add the new worker details
			const workerDoc = await Worker.findById(workerDocId);

			if (!workerDoc) {
				return res.status(404).json({ error: "Документ с рабочим не найден" });
			}

			workerDoc.workers.push({
				name,
				username,
				password: hashPassword,
				roles,
			});

			// Save the updated worker document
			await workerDoc.save();
		}

		// Save the user document
		await user.save();

		res.status(200).json({ message: "Рабочий создан!" });
	} catch (error) {
		res.status(500).json({ error: "Ошибка создания рабочего!" });
	}
};

//good
// export const updateUser = async (req, res, next) => {
// 	try {
// 		const { userId, workerId } = req.body;
// 		// Находим пользователя по его идентификатору
// 		const user = await User.findById(userId).populate("workers");
// 		if (!user) {
// 			return res.status(404).json({ error: "User not found" });
// 		}

// 		// Получаем фактический массив рабочих пользователей
// 		const workersArray = user.workers.workers;

// 		// Находим рабочего пользователя с указанным идентификатором в массиве
// 		const workerIndex = workersArray.findIndex(
// 			(worker) => worker._id.toString() === workerId
// 		);

// 		if (workerIndex === -1) {
// 			return res.status(404).json({ error: "Worker not found" });
// 		}

// 		// Обновляем данные рабочего пользователя
// 		user.workers.workers[workerIndex] = {
// 			...user.workers[workerIndex],
// 			...req.body.workers[0],
// 		};

// 		await user.workers.save();

// 		res.status(200).json({ message: "Worker updated successfully" });
// 	} catch (error) {
// 		console.error("Error updating worker:", error);
// 		res.status(500).json({ error: "Failed to update worker" });
// 	}
// };

export const updateUser = async (req, res, next) => {
	try {
		const { userId, workerId } = req.body;
		const { password, ...otherFields } = req.body.workers[0];
		// Находим пользователя по его идентификатору
		const user = await User.findById(userId).populate("workers");
		if (!user) {
			return res.status(404).json({ error: "Пользователь не найден!" });
		}
		// Получаем фактический массив рабочих пользователей
		const workersArray = user.workers.workers;

		// Находим рабочего пользователя с указанным идентификатором в массиве
		const workerIndex = workersArray.findIndex(
			(worker) => worker._id.toString() === workerId
		);

		if (workerIndex === -1) {
			return res.status(404).json({ error: "Рабочий не найден!" });
		}

		// Обновляем данные рабочего пользователя
		const updatedWorker = {
			...user.workers.workers[workerIndex],
			...otherFields,
		};

		// Если передан новый пароль, зашифруйте его
		if (password) {
			console.log(password);
			const hashedPassword = await bcrypt.hash(password, 7);
			updatedWorker.password = hashedPassword;
		} else {
			// Если новый пароль не был предоставлен, присвоить существующее значение пароля
			updatedWorker.password = user.workers.workers[workerIndex].password;
		}

		updatedWorker.roles = user.workers.workers[workerIndex].roles;
		user.workers.workers[workerIndex] = updatedWorker;
		await user.workers.save();

		res.status(200).json({ message: "Рабочий обновлен!" });
	} catch (error) {
		res.status(500).json({ error: "Ошибка обновления рабочего!" });
	}
};

//good
export const getWorkerById = async (req, res, next) => {
	try {
		const { userId, workerId } = req.body;

		// Находим пользователя по его идентификатору
		const user = await User.findById(userId).populate("workers");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Получаем фактический массив рабочих пользователей
		const workersArray = user.workers.workers;

		// Находим рабочего пользователя с указанным идентификатором в массиве
		const worker = workersArray.find(
			(worker) => worker._id.toString() === workerId
		);

		if (!worker) {
			return res.status(404).json({ error: "Worker not found" });
		}

		res.status(200).json({ worker });
	} catch (error) {
		console.error("Error retrieving worker:", error);
		res.status(500).json({ error: "Failed to retrieve worker" });
	}
};

// Функция вывода пользователей
//good
export const getUser = async (req, res, next) => {
	try {
		const { id } = req.params;

		// Находим пользователя по идентификатору
		const user = await User.findById(id).populate("workers");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Получаем рабочих, на которых ссылается пользователь
		const workers = user.workers;

		res.status(200).json({ workers });
	} catch (error) {
		console.error("Error retrieving workers:", error);
		res.status(500).json({ error: "Failed to retrieve workers" });
	}
};

// Функция удаления пользователя по ID
//good
export const deleteUser = async (req, res, next) => {
	try {
		const { userId, workerId } = req.body;
		console.log(userId, workerId);

		// Находим пользователя по его идентификатору
		const user = await User.findById(userId).populate("workers");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Проверяем, есть ли у пользователя рабочий с указанным идентификатором
		const workerIndex = user.workers.workers.findIndex(
			(worker) => worker._id.toString() === workerId
		);

		if (workerIndex === -1) {
			return res.status(404).json({ error: "Worker not found" });
		}

		// Удаляем рабочего из массива рабочих пользователя
		user.workers.workers.splice(workerIndex, 1);
		console.log(user.workers.workers);

		// Сохраняем изменения в пользователе
		await user.workers.save();

		res.status(200).json({ message: "Worker deleted successfully" });
	} catch (error) {
		console.error("Error deleting worker:", error);
		res.status(500).json({ error: "Failed to delete worker" });
	}
};

//good
export const deleteRole = async (req, res, next) => {
	const { userId, workerId, roleIndex } = req.body;

	try {
		// Find the user by ID
		const user = await User.findById(userId).populate("workers");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const worker = user.workers.workers.find(
			// (worker) => worker._id.toString() === workerId
			(w) => w._id.toString() === workerId
		);

		// Find the worker within the user's workers array
		// const worker = user.workers.find((w) => w._id.toString() === workerId);

		if (!worker) {
			return res.status(404).json({ error: "Worker not found" });
		}

		// Remove the role at the specified index from the worker's roles array
		const deletedRole = worker.roles.splice(roleIndex, 1)[0];
		// Save the updated user
		await user.workers.save();

		res.status(200).json({ deletedRole });
	} catch (err) {
		console.error("Error deleting role for worker:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const addRole = async (req, res, next) => {
	const { userId, workerId, roles } = req.body;

	try {
		// Find the user by ID
		const user = await User.findById(userId).populate("workers");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Find the worker within the user's workers array
		const worker = user.workers.workers.find(
			(w) => w._id.toString() === workerId
		);
		if (!worker) {
			return res.status(404).json({ error: "Worker not found" });
		}

		// Add roles to the worker's roles array
		worker.roles.push(...roles.split(","));

		// Save the updated user
		await user.workers.save();

		res.status(200).json({ message: "Roles added successfully" });
	} catch (err) {
		console.error("Error adding roles for worker:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};
