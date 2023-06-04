import FeedAndAddivitives from "../Models/feedAndAddivitives.js";
import User from "../Models/User.js";
import Worker from "../Models/Worker.js";

// export const update = async (req, res, next) => {
// 	try {
// 		console.log(req.body);
// 		const userId = req.body.userId;
// 		const { name, balance, daily_requirement } = req.body.feed_and_additives[0];

// 		// Find the user by their ID
// 		const user = await User.findById(userId);
// 		if (!user) {
// 			return res.status(404).json({ message: "User not found" });
// 		}

// 		// Check if the user has a reference to the FeedAndAddivitives document
// 		if (!user.feedAndAdditives) {
// 			// If no reference exists, create a new document
// 			const newDocument = new FeedAndAddivitives({
// 				feed_and_additives: [{ name, balance, daily_requirement }],
// 			});
// 			await newDocument.save();

// 			// Update the user with the reference to the new document
// 			user.feedAndAdditives = newDocument._id;
// 			await user.save();

// 			return res.json(newDocument);
// 		} else {
// 			// If a reference exists, update the existing document
// 			const document = await FeedAndAddivitives.findById(user.feedAndAdditives);
// 			if (!document) {
// 				return res.status(404).json({ message: "Document not found" });
// 			}

// 			document.feed_and_additives.push({ name, balance, daily_requirement });
// 			const updatedDocument = await document.save();

// 			return res.json(updatedDocument);
// 		}
// 	} catch (err) {
// 		next(err);
// 	}
// };

export const update = async (req, res, next) => {
	try {
		console.log(req.body);
		const userId = req.body.userId;
		const { name, balance, daily_requirement } = req.body.feed_and_additives[0];

		// Find the user or worker by their ID
		const user = await User.findById(userId);
		const worker = await Worker.findById(userId);
		if (!user && !worker) {
			return res.status(404).json({ message: "User or worker not found" });
		}

		// Check if the user or worker has a reference to the FeedAndAdditives document
		if (!user?.feedAndAdditives && !worker?.feedAndAdditives) {
			// If no reference exists, create a new document
			const newDocument = new FeedAndAdditives({
				feed_and_additives: [{ name, balance, daily_requirement }],
			});
			await newDocument.save();

			// Update the user or worker with the reference to the new document
			if (user) {
				user.feedAndAdditives = newDocument._id;
				await user.save();
			} else {
				worker.feedAndAdditives = newDocument._id;
				await worker.save();
			}

			return res.json(newDocument);
		} else {
			// If a reference exists, update the existing document
			const document = await FeedAndAddivitives.findById(
				user?.feedAndAdditives || worker?.feedAndAdditives
			);
			if (!document) {
				return res.status(404).json({ message: "Document not found" });
			}

			document.feed_and_additives.push({ name, balance, daily_requirement });
			const updatedDocument = await document.save();

			return res.json(updatedDocument);
		}
	} catch (err) {
		next(err);
	}
};

export const changeFeed = async (req, res, next) => {
	try {
		console.log(req.body);
		const { feed } = req.body;
		const { feedId, name, balance, daily_requirement } = feed;
		// const { feedId, name, balance, dailyRequirement } = req.body;

		// Find the document that contains the feed with the given ID
		const document = await FeedAndAddivitives.findOne({
			"feed_and_additives._id": feedId,
		});

		if (!document) {
			return res.status(404).json({ message: "Feed not found" });
		}

		// Find the index of the feed within the array
		const feedIndex = document.feed_and_additives.findIndex(
			(feed) => feed._id.toString() === feedId
		);

		if (feedIndex === -1) {
			return res.status(404).json({ message: "Feed not found" });
		}

		// Update the name, balance, and dailyRequirement of the feed
		document.feed_and_additives[feedIndex].name = name;
		document.feed_and_additives[feedIndex].balance = balance;
		document.feed_and_additives[feedIndex].daily_requirement =
			daily_requirement;

		// Save the updated document
		const updatedDocument = await document.save();

		res.json(updatedDocument);
	} catch (err) {
		next(err);
	}
};

export const remove = async (req, res, next) => {
	try {
		const documentId = req.params.id; // ID of the document to delete

		// Find the FeedAndAddivitives document
		const document = await FeedAndAddivitives.findOne({
			"feed_and_additives._id": documentId,
		});
		if (!document) {
			return res.status(404).json({ message: "Document not found" });
		}

		// Find the index of the object to delete
		const index = document.feed_and_additives.findIndex(
			(item) => item._id.toString() === documentId
		);

		if (index === -1) {
			return res
				.status(404)
				.json({ message: "Object not found in the document" });
		}

		// Remove the object from the feed_and_additives array
		document.feed_and_additives.splice(index, 1);

		// Save the updated document
		await document.save();

		return res.json({ message: "Object deleted from the document" });
	} catch (err) {
		next(err);
	}
};

export const find = async (req, res, next) => {
	try {
		const { userId } = req.query;

		// Find the user by their ID
		const user = await User.findById(userId).populate("feedAndAdditives");
		const worker = await Worker.findById(userId).populate("feedAndAdditives");

		if (!worker && !user) {
			return res.status(404).json({ message: "User not found" });
		}

		let document;
		if (user && user?.feedAndAdditives) {
			document = user.feedAndAdditives;
		} else if (worker && worker?.feedAndAdditives?.feed_and_additives) {
			document = worker.feedAndAdditives;
		} else {
			return res
				.status(404)
				.json({ message: "Document not found for the user" });
		}
		return res.json(document);
	} catch (err) {
		next(err);
	}
};
