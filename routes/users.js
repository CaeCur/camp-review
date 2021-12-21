const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

//get the db models
const User = require("../models/User");
//END get the db models

router.get("/register", (req, res) => {
	res.render("users/register");
});

router.post(
	"/register",
	catchAsync(async (req, res, next) => {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		try {
			const passportRegister = await User.register(user, password);
			//req.login requires a callback so we can't await it.
			//doing this is required to avoid the bad UX of logging in after you have just registered
			req.login(passportRegister, (err) => {
				if (err) return next(err);
				req.flash("success", "Welcome to CampFire!");
				res.redirect("/campgrounds");
			});
		} catch (e) {
			req.flash("error", e.message);
			res.redirect("/register");
		}
	})
);

router.get("/login", (req, res) => {
	res.render("users/login");
});

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
	req.flash("success", "Welcome back");
	const redirectUrl = req.session.returnTo || "/campgrounds";
	delete req.session.returnTo;
	res.redirect(redirectUrl);
});

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Successfully logged out");
	res.redirect("/campgrounds");
});

module.exports = router;
