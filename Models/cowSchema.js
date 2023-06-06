import mongoose from "mongoose";

const dairySchema = new mongoose.Schema(
	{
		dairies: [
			{
				date: { type: Date, required: false },
				milk_production: { type: Number, required: true },
				milk_truck_order: { type: Number, required: true },
				gross_yield: { type: Number, required: true },
				milk_consumption: { type: Number, required: true },
				heifers: { type: Number, required: true },
				cows: { type: Number, required: true },
				// hutch_number: { type: Number, required: true },
				// calves_per_hutch: { type: Number, required: true },
				abortions: { type: Number, required: true },
				young_animal_losses: { type: Number, required: true },
				stillbirths: { type: Number, required: true },
				losses_during_fattening_of_cows: { type: Number, required: true },
				losses_of_main_herd_cows: { type: Number, required: true },
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("Dairy", dairySchema);
