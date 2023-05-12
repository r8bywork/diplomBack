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

		// Find the document that contains the house with the given ID
		const document = await House.findOne({ "houses._id": houseId });

		if (!document) {
			return res.status(404).json({ message: "House not found" });
		}

		// Find the index of the house within the array
		const houseIndex = document.houses.findIndex(
			(house) => house._id.toString() === houseId
		);

		if (houseIndex === -1) {
			return res.status(404).json({ message: "House not found" });
		}

		// Update the name and cowsCount of the house
		document.houses[houseIndex].name = name;
		document.houses[houseIndex].cowsCount = cowsCount;

		// Save the updated document
		const updatedDocument = await document.save();

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

export const getAllHouses = async (req, res, next) => {
	try {
		const houses = await House.find({});
		res.json(houses);
	} catch (err) {
		next(err);
	}
};
