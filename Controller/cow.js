import Dairy from "../Models/cowSchema.js";
import User from "../Models/User.js";
import Worker from "../Models/Worker.js";

export const create = async (req, res, next) => {
	try {
		const date = new Date();
		date.setHours(date.getHours() + 3);
		const dateWithAddedHours = date.toISOString();
		const dairy = new Dairy({
			...req.body,
			createdAt: dateWithAddedHours,
		});
		await dairy.save();
		res.json(dairy);
	} catch (err) {
		next(err);
	}
};

// export const update = async (req, res, next) => {
// 	try {
// 		const userId = req.params.id;
// 		const updates = req.body;

// 		const user = await User.findById(userId).populate("dairy");
// 		const worker = await Worker.findById(userId).populate("dairy");

// 		let dairy;
// 		if (user && user?.dairy) {
// 			dairy = user.dairy;
// 		} else if (worker && worker?.dairy) {
// 			dairy = worker.dairy;
// 		}

// 		if (!dairy) {
// 			// If the user doesn't have a dairy document, create a new one and assign it to the user
// 			const newDairy = new Dairy({ dairies: updates.dairies });
// 			await newDairy.save();

// 			if (user) {
// 				user.dairy = newDairy._id;
// 				await user.save();
// 			} else if (worker) {
// 				worker.dairy = newDairy._id;
// 				await worker.save();

// 				// Assign the dairy document to the corresponding user
// 				const user = await User.findOne({ workers: worker._id });
// 				if (user) {
// 					user.dairy = newDairy._id;
// 					await user.save();
// 				}
// 			}

// 			return res.json(newDairy);
// 		}

// 		// Update or add the new object(s) to the existing dairies array
// 		updates.dairies.forEach((newDairy) => {
// 			const existingDairy = dairy.dairies.find((d) => {
// 				const existingDate = new Date(d.date);
// 				const newDate = new Date(newDairy.date);
// 				return (
// 					existingDate.toISOString().split("T")[0] ===
// 					newDate.toISOString().split("T")[0]
// 				);
// 			});

// 			if (existingDairy) {
// 				// If a dairy object with the same date exists, update its properties
// 				for (const field in newDairy) {
// 					const value = parseFloat(newDairy[field]);
// 					if (isNaN(value)) {
// 						return res.status(400).json({ error: "Invalid value" });
// 					}

// 					if (value >= 0) {
// 						existingDairy[field] += value; // Add the value if it's positive
// 					} else {
// 						existingDairy[field] -= Math.abs(value); // Subtract the absolute value if it's negative
// 					}
// 				}
// 			} else {
// 				dairy.dairies.push(newDairy);
// 			}
// 		});

// 		const updatedDairy = await dairy.save();

// 		return res.json(updatedDairy);
// 	} catch (err) {
// 		next(err);
// 	}
// };

// Функция getAllByExpression без изменений

export const update = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const updates = req.body;

		const user = await User.findById(userId).populate("dairy");
		const worker = await Worker.findById(userId).populate("dairy");

		let dairy;
		if (user && user?.dairy) {
			dairy = user.dairy;
		} else if (worker && worker?.dairy) {
			dairy = worker.dairy;
		}

		if (!dairy) {
			// Если документ отсутствует, создаем новый и присваиваем его пользователю или рабочему
			const newDairy = new Dairy({ dairies: updates.dairies });
			await newDairy.save();

			if (user) {
				user.dairy = newDairy._id;
				await user.save();
			} else if (worker) {
				worker.dairy = newDairy._id;
				await worker.save();

				const user = await User.findOne({ workers: worker._id });
				if (user) {
					user.dairy = newDairy._id;
					await user.save();
				}
			}

			return res.json(newDairy);
		}

		const today = new Date();
		const todayDairy = dairy.dairies.find((d) => {
			const dairyDate = new Date(d.date);
			return (
				dairyDate.toISOString().split("T")[0] ===
				today.toISOString().split("T")[0]
			);
		});

		if (todayDairy) {
			// Если сегодняшний документ уже существует, обновляем его поля согласно запросу
			updates.dairies.forEach((newDairy) => {
				const existingDairy = dairy.dairies.find((d) => {
					const existingDate = new Date(d.date);
					const newDate = new Date(newDairy.date);
					return (
						existingDate.toISOString().split("T")[0] ===
						newDate.toISOString().split("T")[0]
					);
				});

				if (existingDairy) {
					// Обновляем поля объекта, если он существует
					for (const field in newDairy) {
						const value = parseFloat(newDairy[field]);
						if (isNaN(value)) {
							return res.status(400).json({ error: "Invalid value" });
						}

						if (value >= 0) {
							existingDairy[field] += value;
						} else {
							existingDairy[field] -= Math.abs(value);
						}
					}
				} else {
					// Добавляем новый объект в массив документов
					dairy.dairies.push(newDairy);
				}
			});

			await dairy.save();
			return res.json(dairy);
		} else {
			const previousDairies = dairy.dairies.filter(
				(d) => new Date(d.date) < today
			);

			if (previousDairies.length > 0) {
				// Вычисляем сумму полей из предыдущих документов
				const newDairy = updates.dairies[0];
				const sumFields = [
					"stillbirths",
					"heifers",
					"cows",
					"young_animal_losses",
					"losses_during_fattening_of_cows",
					"losses_of_main_herd_cows",
				];

				sumFields.forEach((field) => {
					newDairy[field] = previousDairies.reduce(
						(sum, prevDairy) => sum + prevDairy[field],
						newDairy[field]
					);
				});

				dairy.dairies.push(newDairy);
				await dairy.save();
				return res.json(dairy);
			} else {
				// Добавляем новый объект на сегодняшний день без вычисления суммы
				dairy.dairies.push(updates.dairies[0]);
				await dairy.save();
				return res.json(dairy);
			}
		}
	} catch (err) {
		next(err);
	}
};

export const getOne = async (req, res, next) => {
	const currentDate = new Date();

	currentDate.setHours(3, 0, 0, 0);
	const nextDay = new Date();
	nextDay.setHours(3, 0, 0, 0);
	nextDay.setDate(nextDay.getDate() + 1);

	const aggregate = await Dairy.aggregate([
		{
			$match: {
				$and: [
					{ createdAt: { $gte: currentDate } },
					{ createdAt: { $lte: nextDay } },
				],
			},
		},
	]);
	const result = aggregate && aggregate.length ? aggregate[0] : null;
	return res.json(result);
};

export const getTodayDairy = async (req, res, next) => {
	const user = await User.findById(req.params.id).populate("dairy");
	if (!user || !user.dairy) {
		return res.status(404).json({ message: "User or dairy not found" });
	}

	const dairy = user.dairy;
	const today = new Date().toISOString().split("T")[0];
	const todayDairy = dairy.dairies.find(
		(d) => d.date.toISOString().split("T")[0] === today
	);

	if (todayDairy) {
		return res.json(todayDairy);
	} else {
		return res.json({ message: "Today's dairy not found" });
	}
};

export const getAllByExpression = async (req, res, next) => {
	const userId = req.params.id;
	const startDate = req.query.startDate;
	const endDate = req.query.endDate;

	const user = await User.findById(userId).populate("dairy");
	const worker = await Worker.findById(userId).populate("dairy");
	if ((!user || !user.dairy) && (!worker || !worker.dairy)) {
		return res.status(404).json({ message: "User or dairy not found" });
	}

	let dairy;
	if (user && user?.dairy) {
		dairy = user.dairy;
	} else if (worker && worker?.dairy) {
		dairy = worker.dairy;
	} else {
		return res.status(404).json({ message: "Document not found for the user" });
	}

	const filteredDairies = dairy.dairies.filter((d) => {
		const dairyDate = new Date(d.date);

		return dairyDate >= new Date(startDate) && dairyDate <= new Date(endDate);
	});

	const sortedDairies = filteredDairies.sort((a, b) => {
		const dateA = new Date(a.date.$date);
		const dateB = new Date(b.date.$date);
		return dateA - dateB;
	});

	return res.json(sortedDairies);
};
