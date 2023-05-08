import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import authRouter from "./Routes/authRouter.js";
const PORT = process.env.PORT || 3001;
const app = express();
//Midleware
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
	})
);
//Routes
app.use("/auth", authRouter);

const start = async () => {
	try {
		await mongoose.connect(`mongodb://localhost:27017/shop`);
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (e) {
		console.log(e);
	}
};

start();
