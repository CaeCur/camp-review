const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
//route deps
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");
//db deps
const dbConnect = require("./utils/db");

/***** DATABASE *****/

// connection
dbConnect();

// models
const Review = require("./models/Review");
const Campground = require("./models/Campground");

/***** END DATABASE *****/

/***** EXPRESS CONFIG *****/

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//ensure that the body is parsed REVIEW THIS
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); //this tells express to serve our static folder
const sessionConfig = {
	secret            : "secret",
	resave            : false,
	saveUninitialized : true,
	cookie            : {
		httpOnly : true,
		expires  : Date.now() + 1000 * 60 * 60 * 24 * 7, //this crazy set of numbers is just adding 7 days onto today
		maxAge   : 1000 * 60 * 60 * 24 * 7
	}
};
app.use(session(sessionConfig));
app.use(flash());

/***** END EXPRESS CONFIG *****/

/***** MIDDLEWARE *****/

//flash
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

/***** END MIDDLEWARE *****/

/***** ROUTES *****/

app.get("/", (req, res) => {
	res.render("home");
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

/***** END ROUTES *****/

/***** ERROR HANDLING *****/

app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "Something went wrong";
	res.status(statusCode).render("error", { err });
});

/***** END ERROR HANDLING *****/

app.listen(3000, () => {
	console.log("serving on port 3000");
});
