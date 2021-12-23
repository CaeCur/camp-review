const express = require("express");
const router = express.Router();
const Users = require("../controllers/Users");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

//get the db models
const User = require("../models/User");
//END get the db models

router.route("/register").get(Users.getRegister).post(catchAsync(Users.postRegister));

router
	.route("/login")
	.get(Users.getLogin)
	.post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), Users.postLogin);

router.get("/logout", Users.getLogout);

module.exports = router;
