import { Schema, model } from "mongoose";

const WorkerSchema = new Schema({
	workers: [
		{
			username: { type: String, required: true },
			password: { type: String, required: true },
			roles: [String],
		},
	],
	house: {
		type: Schema.Types.ObjectId,
		ref: "House",
	},
	dairy: {
		type: Schema.Types.ObjectId,
		ref: "Dairy",
	},
	feedAndAdditives: {
		type: Schema.Types.ObjectId,
		ref: "FeedAndAddivitives",
	},
});

const Worker = model("Worker", WorkerSchema);

export default Worker;
