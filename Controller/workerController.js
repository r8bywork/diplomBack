import User from "../Models/User.js";
import Worker from "../Models/Worker.js";

// export const createWorker = async (req, res, next) => {
// 	try {
// 		const { id } = req.params;
// 		const { username, password, roles } = req.body.worker[0];
// 		console.log(username, password, roles);
// 		// console.log(req.body);
// 		const user = await User.findById(id)
// 			.populate("house")
// 			.populate("dairy")
// 			.populate("feedAndAdditives");

// 		if (!user) {
// 			return res.status(404).json({ error: "User not found" });
// 		}

// 		const workerDocId = user.workers;
// 		if (!workerDocId) {
// 			// If the worker document doesn't exist, create a new document and add the worker details
// 			const newWorkerDoc = new Worker({
// 				workers: [
// 					{
// 						username,
// 						password,
// 						roles,
// 					},
// 				],
// 				house: user.house,
// 				dairy: user.dairy,
// 				feedAndAdditives: user.feedAndAdditives,
// 			});

// 			// Save the new worker document
// 			const savedWorkerDoc = await newWorkerDoc.save();
// 			console.log("asdasdasdasdasdasdasasdasdasd");
// 			// Update the workers field in the user document with the new worker document's ID
// 			user.workers = savedWorkerDoc._id;
// 		} else {
// 			// If the worker document exists, retrieve the document and add the new worker details
// 			const workerDoc = await Worker.findById(workerDocId);

// 			if (!workerDoc) {
// 				return res.status(404).json({ error: "Worker document not found" });
// 			}

// 			workerDoc.worker.push({
// 				username,
// 				password,
// 				roles,
// 			});

// 			// Save the updated worker document
// 			await workerDoc.save();
// 		}

// 		// Save the user document
// 		await user.save();

// 		res.status(200).json({ message: "Worker created successfully" });
// 	} catch (error) {
// 		console.error("Error creating worker:", error);
// 		res.status(500).json({ error: "Failed to create worker" });
// 	}
// };

export const createWorker = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { username, password, roles } = req.body.worker[0];
		console.log(username, password, roles);

		const user = await User.findById(id)
			.populate("house")
			.populate("dairy")
			.populate("feedAndAdditives");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const workerDocId = user.workers;

		if (!workerDocId) {
			// If the worker document doesn't exist, create a new document and add the worker details
			const newWorkerDoc = new Worker({
				workers: [
					{
						username,
						password,
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
				return res.status(404).json({ error: "Worker document not found" });
			}

			workerDoc.workers.push({
				username,
				password,
				roles,
			});

			// Save the updated worker document
			await workerDoc.save();
		}

		// Save the user document
		await user.save();

		res.status(200).json({ message: "Worker created successfully" });
	} catch (error) {
		console.error("Error creating worker:", error);
		res.status(500).json({ error: "Failed to create worker" });
	}
};

// Функция изменения пользователя по ID
export const updateUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updatedData = req.body; // Обновленные данные пользователя

		const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json({ message: "User updated successfully", user });
	} catch (error) {
		console.error("Error updating user:", error);
		res.status(500).json({ error: "Failed to update user" });
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
