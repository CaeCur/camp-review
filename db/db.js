const mongoose = require("mongoose");

/***** DATABASE *****/

// connection
const dbConnect = () => {
	mongoose.connect("mongodb://localhost:27017/yelp-camp", {});
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
