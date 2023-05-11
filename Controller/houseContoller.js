// import House from "../Models/House";
import House from "../Models/House.js";
export const addHouse = async (req, res, next) => {
	try {
		const { houses } = req.body;
		const { name, cowsCount } = houses[0];
		const newHouse = { name, cowsCount };
		console.log(req.body);

		const documentExists = await House.exists({});
		if (documentExists) {
			const updatedDocument = await House.findOneAndUpdate(
				{},
				{ $push: { houses: newHouse } },
				{ new: true }
			);
			return res.json(updatedDocument);
		} else {
			const newDocument = new House({ houses: [newHouse] });
			const savedDocument = await newDocument.save();
			return res.json(savedDocument);
		}
	} catch (err) {
		next(err);
	}
};

export const updateHouse = async (req, res, next) => {
	try {
		const { houseId, name, cowsCount } = req.body;
		const updatedDocument = await House.findOneAndUpdate(
			{ "houses._id": houseId },
			{ $set: { "houses.$.name": name, "houses.$.cowsCount": cowsCount } },
			{ new: true }
		);
		res.json(updatedDocument);
	} catch (err) {
		next(err);
	}
};

export const deleteHouse = async (req, res, next) => {
	try {
		const { houseId } = req.params;
		const updatedDocument = await House.findOneAndUpdate(
			{},
			{ $pull: { houses: { _id: houseId } } },
			{ new: true }
		);
		res.json(updatedDocument);
	} catch (err) {
		next(err);
	}
};
