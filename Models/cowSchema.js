// const mongoose = require("mongoose");
import mongoose from "mongoose";

const cowSchema = new mongoose.Schema({
	date: { type: Date, required: true },
	milkProduction: { type: Number, required: true },
	milkTrucksNeeded: { type: Number, required: true },
	milkYield: { type: Number, required: true },
	milkConsumed: { type: Number, required: true },
	calvesHoused: { type: Number, required: true },
	calvesFeeding: { type: Number, required: true },
	nonProductiveLosses: {
		abortion: { type: Number, required: true },
		calfMortality: { type: Number, required: true },
		stillbirth: { type: Number, required: true },
		feedlotCows: { type: Number, required: true },
		herdCows: { type: Number, required: true },
	},
	feed: {
		types: {
			name: { type: String },
			remaining: { type: Number },
			need: { type: Number },
		},
	},
	createdAt: { type: Date, required: true },
	updatedAt: { type: Date, required: true },
});

module.exports = mongoose.model("Cow", cowSchema);
