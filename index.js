import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import authRouter from "./Routes/authRouter.js";
import test from "./Routes/cowRouter.js";
import feedAndAddivitives from "./Routes/feedAndAddivitives.js";
import houseRouter from "./Routes/houseRouter.js";
import userRouter from "./Routes/userRouter.js";
const PORT = 3001; /*process.env.PORT || 3001;*/
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
app.use("/row", test);
app.use("/feedAndAddivitives", feedAndAddivitives);
app.use("/user", userRouter);
app.use("/houses", houseRouter);

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
