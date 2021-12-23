const express = require("express");
const router = express.Router();
const Users = require("../controllers/Users");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

//get the db models
const User = require("../models/User");
//END get the db models

router.get("/register", Users.getRegister);

router.post("/register", catchAsync(Users.postRegister));

router.get("/login", Users.getLogin);

router.post(
	"/login",
	passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
	Users.postLogin
);

router.get("/logout", Users.getLogout);

module.exports = router;
