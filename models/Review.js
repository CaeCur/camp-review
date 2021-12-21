const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
	body   : String,
	rating : {
		type     : Number,
		min      : 0,
		max      : 5,
		required : true
	},
	author : {
		type : Schema.Types.ObjectId,
		ref  : "User"
	}
});

module.exports = mongoose.model("Review", reviewSchema);
