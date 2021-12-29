const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review");

/*
Let's use a mongo virtual property to inject a small width into our cloudinary
request so that it returns a thumbnail sized picture
*/
const imageSchema = new Schema({
	url      : String,
	filename : String
});

imageSchema.virtual("thumbnail").get(function () {
	return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema(
	{
		title       : String,
		images      : [ imageSchema ],
		price       : Number,
		description : String,
		location    : String,
		geometry    : {
			type        : {
				type     : String,
				enum     : [ "Point" ],
				required : true
			},
			coordinates : {
				type     : [ Number ],
				required : true
			}
		},
		reviews     : [
			{
				type : Schema.Types.ObjectId,
				ref  : "Review"
			}
		],
		author      : {
			type : Schema.Types.ObjectId,
			ref  : "User"
		}
	},
	opts
);

campgroundSchema.virtual("properties.popupHtml").get(function () {
	return `
	<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
	<p>${this.description.substring(0, 20)}...</p>
	`;
});

campgroundSchema.post("findOneAndDelete", async function (camp) {
	if (camp) {
		await Review.deleteMany({
			_id : { $in: camp.reviews }
		});
	}
});

module.exports = mongoose.model("Campground", campgroundSchema);
