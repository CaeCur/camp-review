const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL;

/***** DATABASE *****/
//"mongodb://localhost:27017/yelp-camp"

// connection
const dbConnect = () => {
	mongoose.connect(dbUrl, {});
	const db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error:"));
	db.once("open", () => {
		console.log("database connected");
	});
};

// models
const Review = require("../models/Review");
const Campground = require("../models/Campground");

/***** END DATABASE *****/
