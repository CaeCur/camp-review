const User = require("../models/User");

module.exports.getRegister = (req, res) => {
	res.render("users/register");
};

module.exports.postRegister = async (req, res, next) => {
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
};

module.exports.getLogin = (req, res) => {
	res.render("users/login");
};

module.exports.postLogin = (req, res) => {
	req.flash("success", "Welcome back");
	const redirectUrl = req.session.returnTo || "/campgrounds";
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.getLogout = (req, res) => {
	req.logout();
	req.flash("success", "Successfully logged out");
	res.redirect("/campgrounds");
};
