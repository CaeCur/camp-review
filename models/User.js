const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passport = require("passport-local-mongoose");

const userSchema = new Schema({
	email : {
		type     : String,
		required : [ true, "email must be provided" ]
	}
});

userSchema.plugin(passport); //passport will add on username and password in the background

module.exports = mongoose.model("User", userSchema);
