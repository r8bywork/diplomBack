import mongoose from "mongoose";
import FeedAndAddivitives from "../Models/feedAndAddivitives.js";

export const update = async (req, res, next) => {
	try {
		const collectionExists = await mongoose.connection.db
			.listCollections({ name: "feedandaddivitives" })
			.hasNext();
		if (!collectionExists) {
			await mongoose.connection.createCollection("feedandaddivitives");
			console.log("FeedAndAddivitives collection created");
		}

		const foundDocument = await FeedAndAddivitives.findOne({});
		if (!foundDocument) {
			const newDocument = new FeedAndAddivitives();
			newDocument.feed_and_additives.push(req.body);
			await newDocument.save();
			console.log("New document created and feed added:", newDocument);
			return res.json(newDocument);
		}

		foundDocument.feed_and_additives.push(req.body);
		const updatedDocument = await foundDocument.save();
		console.log("New feed added to existing document:", updatedDocument);
		return res.json(updatedDocument);
	} catch (err) {
		console.error("Failed to create FeedAndAddivitives collection:", err);
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
		const feedId = req.params.id;
		const result = await FeedAndAddivitives.updateOne(
			{},
			{ $pull: { feed_and_additives: { _id: feedId } } }
		);
		res.json(result);
	} catch (err) {
		next(err);
	}
};

export const find = async (req, res, next) => {
	try {
		const feedAndAddivitives = await FeedAndAddivitives.find({});
		return res.json(feedAndAddivitives);
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
	const aggregate = await FeedAndAddivitives.aggregate([
		{
			$match: {
				_id: new mongoose.Types.ObjectId(req.params.id),
			},
		},
		{
			$lookup: {
				from: "dairies",
				let: { feedAndAddivitives: "$_id" },
				pipeline: [
					{
						$match: {
							$and: [
								{
									$expr: {
										$eq: ["$feedAndAddivitives", "$$feedAndAddivitives"],
									},
								},
								{ createdAt: { $gte: currentDate } },
								{ createdAt: { $lte: nextDay } },
							],
						},
					},
				],
				as: "daires",
			},
		},
	]);
	return res.json(aggregate);
};

export const getByExpression = async (req, res, next) => {
	const [date] = [req.query.date];
	// console.log("req query", req.query);
	// console.log("date", date);
	const splitDate = date.split(";;");
	const aggregate = await FeedAndAddivitives.aggregate([
		{
			$lookup: {
				from: "dairies",
				let: { feedAndAddivitives: "$_id" },
				pipeline: [
					{
						$match: {
							$and: [
								{
									$expr: {
										$eq: ["$feedAndAddivitives", "$$feedAndAddivitives"],
									},
								},
								{ createdAt: { $gte: new Date(splitDate[0]) } },
								{ createdAt: { $lte: new Date(splitDate[1]) } },
							],
						},
					},
				],
				as: "daires",
			},
		},
	]);
	return res.json(aggregate);
};
