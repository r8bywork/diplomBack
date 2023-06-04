// import House from "../Models/House";
import House from "../Models/House.js";
import User from "../Models/User.js";
import Worker from "../Models/Worker.js";

//good
// export const addHouse = async (req, res, next) => {
// 	try {
// 		console.log(req.body);
// 		const { name, cowsCount } = req.body.houses[0];
// 		const newHouse = { name, cowsCount };

// 		// Find the user by their username (or any other identifier)
// 		const user = await User.findOne({ username: req.body.username }); // Assuming you have a way to retrieve the authenticated user's username or other identifier
// 		if (!user) {
// 			return res.status(404).json({ message: "User not found" });
// 		}

// 		// Check if the user already has a house document
// 		if (user.house) {
// 			const existingHouse = await House.findById(user.house);
// 			if (!existingHouse) {
// 				return res
// 					.status(404)
// 					.json({ message: "House document not found for the user" });
// 			}

// 			existingHouse.houses.push(newHouse);
// 			await existingHouse.save();

// 			return res.json(existingHouse);
// 		}

// 		const newDocument = new House({ houses: [newHouse] });
// 		const savedDocument = await newDocument.save();

// 		// Associate the new house document with the user
// 		user.house = savedDocument._id;
// 		await user.save();

// 		return res.json(savedDocument);
// 	} catch (err) {
// 		next(err);
// 	}
// };

export const addHouse = async (req, res, next) => {
	try {
		console.log(req.body);
		const { name, cowsCount } = req.body.houses[0];
		const username = req.body.username;
		const newHouse = { name, cowsCount };

		// Find the user by their username (or any other identifier)
		const user = await User.findById(username).populate("house");
		const worker = await Worker.findById(username).populate("house");

		if (!worker && !user) {
			return res.status(404).json({ message: "User or Worker not found" });
		}

		// Check if the user or worker already has a house document
		if (user && user.house) {
			const existingHouse = await House.findById(user.house);
			if (!existingHouse) {
				return res
					.status(404)
					.json({ message: "House document not found for the user" });
			}

			existingHouse.houses.push(newHouse);
			await existingHouse.save();

			return res.json(existingHouse);
		} else if (worker && worker.house) {
			const existingHouse = worker.house;
			existingHouse.houses.push(newHouse);
			await existingHouse.save();

			return res.json(existingHouse);
		}

		const newDocument = new House({ houses: [newHouse] });
		const savedDocument = await newDocument.save();

		// Associate the new house document with the user or worker
		if (user) {
			user.house = savedDocument._id;
			await user.save();
		} else if (worker) {
			worker.house = savedDocument._id;
			await worker.save();
		}

		return res.json(savedDocument);
	} catch (err) {
		next(err);
	}
};

//good
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

//good
export const deleteHouse = async (req, res, next) => {
	try {
		const documentId = req.params.id; // ID of the document to delete

		// Find the House document
		const document = await House.findOne({
			"houses._id": documentId,
		});
		if (!document) {
			return res.status(404).json({ message: "Document not found" });
		}

		// Find the index of the object to delete
		const index = document.houses.findIndex(
			(item) => item._id.toString() === documentId
		);

		if (index === -1) {
			return res
				.status(404)
				.json({ message: "Object not found in the document" });
		}

		// Remove the object from the houses array
		document.houses.splice(index, 1);

		// Save the updated document
		await document.save();

		return res.json({ message: "Object deleted from the document" });
	} catch (err) {
		next(err);
	}
};

//good
export const getAllHouses = async (req, res, next) => {
	try {
		const { userId } = req.query; // Предположим, что идентификатор пользователя передается в параметрах запроса

		// Находим документ пользователя по идентификатору
		const user = await User.findById(userId).populate("house");
		const worker = await Worker.findById(userId).populate("house");

		if (!worker && !user) {
			return res.status(404).json({ message: "User not found" });
		}

		let houses;
		if (user && user?.house) {
			houses = user.house;
		} else if (worker && worker?.house) {
			houses = worker.house;
		} else {
			return res
				.status(404)
				.json({ message: "Document not found for the user" });
		}

		// Получаем домики, связанные с пользователем
		res.json(houses);
	} catch (err) {
		next(err);
	}
};
