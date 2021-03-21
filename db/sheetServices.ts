import mongoose from "mongoose";
import { MONGO_URL } from "../config/env";

mongoose
	.connect(MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => console.log("connected to mongoose"));
