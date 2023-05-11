import { Schema, model } from "mongoose";
// Определение схемы для домика
const House = new Schema({
	houses: [
		{
			name: {
				type: String,
				required: true,
			},
			cowsCount: {
				type: Number,
				default: 0,
			},
		},
	],
});

export default model("House", House);
