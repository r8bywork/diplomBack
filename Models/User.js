import { Schema, model } from "mongoose";

const User = new Schema({
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phoneNumber: { type: String, required: true, unique: true },
	organizationName: { type: String, required: true },
	roles: [
		{
			type: String,
			ref: "Role",
		},
	],
});

export default model("User", User);
