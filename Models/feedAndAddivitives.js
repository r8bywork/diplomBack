import mongoose from "mongoose";
const FeedAndAddivitives = new mongoose.Schema(
	{
		feed_and_additives: [
			{
				name: { type: String, required: true },
				balance: { type: Number, required: true },
				daily_requirement: { type: Number, required: true },
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("FeedAndAddivitives", FeedAndAddivitives);
