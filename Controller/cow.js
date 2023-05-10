import Dairy from "../Models/cowSchema.js";
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
export const update = async (req, res, next) => {
	try {
		const dairyDB = await Dairy.findById(req.params.id);
		if (!dairyDB) return res.sendStatus(404);
		const dairyUpdate = await Dairy.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		return res.json(dairyUpdate);
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
export const getAllByExpression = async (req, res, next) => {
	const [date] = [req.query.date];
	const splitDate = date.split(";;");
	const aggregate = await Dairy.aggregate([
		{
			$match: {
				$and: [
					{ createdAt: { $gte: new Date(splitDate[0]) } },
					{ createdAt: { $lte: new Date(splitDate[1]) } },
				],
			},
		},
	]);
	return res.json(aggregate);
};
