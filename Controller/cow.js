import Dairy from "../Models/cowSchema.js";
import User from "../Models/User.js";

export const create = async (req, res, next) => {
	try {
		const date = new Date();
		date.setHours(date.getHours() + 3);
		const dateWithAddedHours = date.toISOString();
		// const dairy = new Dairy(req.body);
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
// 		const dairyDB = await Dairy.findById(req.params.id);
// 		if (!dairyDB) return res.sendStatus(404);
// 		const dairyUpdate = await Dairy.findByIdAndUpdate(req.params.id, req.body, {
// 			new: true,
// 		});
// 		return res.json(dairyUpdate);
// 	} catch (err) {
// 		next(err);
// 	}
// };

// export const update = async (req, res, next) => {
// 	try {
// 		const dairyDB = await Dairy.findById(req.params.id);
// 		if (!dairyDB) return res.sendStatus(404);

// 		const updates = req.body;

// 		for (const field in updates) {
// 			const value = parseFloat(updates[field]);
// 			if (isNaN(value)) {
// 				return res.status(400).json({ error: "Invalid value" });
// 			}

// 			if (value >= 0) {
// 				dairyDB[field] += value; // Сложение, если значение положительное
// 			} else {
// 				dairyDB[field] -= Math.abs(value); // Вычитание, если значение отрицательное
// 			}
// 		}

// 		const dairyUpdate = await dairyDB.save(); // Сохраняем обновленный документ

// 		return res.json(dairyUpdate);
// 	} catch (err) {
// 		next(err);
// 	}
// };

export const update = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const updates = req.body;

		const user = await User.findById(userId).populate("dairy");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const dairy = user.dairy;
		if (!dairy) {
			// If the user doesn't have a dairy document, create a new one and assign it to the user
			const newDairy = new Dairy({ dairies: updates.dairies });
			await newDairy.save();

			user.dairy = newDairy._id;
			await user.save();

			return res.json(newDairy);
		}

		// Update or add the new object(s) to the existing dairies array
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
				// If a dairy object with the same date exists, update its properties
				for (const field in newDairy) {
					const value = parseFloat(newDairy[field]);
					if (isNaN(value)) {
						return res.status(400).json({ error: "Invalid value" });
					}

					if (value >= 0) {
						existingDairy[field] += value; // Add the value if it's positive
					} else {
						existingDairy[field] -= Math.abs(value); // Subtract the absolute value if it's negative
					}
				}
			} else {
				// If a dairy object with the same date doesn't exist, add the new dairy object
				dairy.dairies.push(newDairy);
			}
		});

		const updatedDairy = await dairy.save();

		return res.json(updatedDairy);
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
	// console.log("current date", currentDate.toISOString());
	// console.log("next day", nextDay);
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

// export const getAllByExpression = async (req, res, next) => {
// 	const [date] = [req.query.date];
// 	const splitDate = date.split(";;");
// 	const aggregate = await Dairy.aggregate([
// 		{
// 			$match: {
// 				$and: [
// 					{ createdAt: { $gte: new Date(splitDate[0]) } },
// 					{ createdAt: { $lte: new Date(splitDate[1]) } },
// 				],
// 			},
// 		},
// 	]);
// 	return res.json(aggregate);
// };

// export const getAllByExpression = async (req, res, next) => {
// 	const userId = req.params.id;
// 	const startDate = req.query.startDate;
// 	const endDate = req.query.endDate;

// 	const user = await User.findById(userId).populate("dairy");
// 	if (!user || !user.dairy) {
// 		return res.status(404).json({ message: "User or dairy not found" });
// 	}

// 	const dairy = user.dairy;

// 	const aggregate = await Dairy.aggregate([
// 		{
// 			$match: {
// 				$and: [
// 					{ createdAt: { $gte: new Date(startDate) } },
// 					{ createdAt: { $lte: new Date(endDate) } },
// 				],
// 			},
// 		},
// 	]);

// 	return res.json(aggregate);
// };

export const getAllByExpression = async (req, res, next) => {
	const userId = req.params.id;
	const startDate = req.query.startDate;
	const endDate = req.query.endDate;

	const user = await User.findById(userId).populate("dairy");
	if (!user || !user.dairy) {
		return res.status(404).json({ message: "User or dairy not found" });
	}

	const dairy = user.dairy;

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
