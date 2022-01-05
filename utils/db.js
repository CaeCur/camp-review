const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

module.exports = () => {
	mongoose.connect(dbUrl, {});
	const db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error:"));
	db.once("open", () => {
		console.log("database connected");
	});
};
