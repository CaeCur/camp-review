const mongoose = require("mongoose");
const Campground = require("../models/Campground");

const cities = require("./cities");
const { places, descriptors } = require("./seederHelpers");

//set up db connection
mongoose.connect("mongodb://localhost:27017/yelp-camp", {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("database connected");
});
//end db connection

const seedDb = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const rand67 = Math.floor(Math.random() * 67);
		const price = Math.floor(Math.random() * 10) + 10;
		const randCamp = (array) => array[Math.floor(Math.random() * array.length)];

		const camp = new Campground({
			location    : `${cities[rand67].city}, ${cities[rand67].admin_name}`,
			title       : `${randCamp(descriptors)} ${randCamp(places)}`,
			image       : "https://source.unsplash.com/collection/1273441",
			description :
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium urna at bibendum finibus. Morbi pretium non odio eget bibendum. Nunc dui arcu, aliquam consequat tempus a, volutpat ac lorem. Nullam semper orci id venenatis viverra. Vestibulum et gravida purus. Quisque hendrerit sollicitudin sapien vitae molestie.",
			price       : price,
			author      : "61bb19568bf6ef9915543eff"
		});

		await camp.save();
	}
};

seedDb().then(() => mongoose.connection.close());
