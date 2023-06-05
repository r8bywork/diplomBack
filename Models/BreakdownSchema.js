import mongoose from "mongoose";

const BreakdownSchema = new mongoose.Schema({
	addedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Worker",
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ["На рассмотрении", "В обработке", "Сделано", "Переделать"],
		default: "На рассмотрении",
	},
});

const Breakdown = mongoose.model("Breakdown", BreakdownSchema);

// module.exports = Breakdown;
export default Breakdown;
