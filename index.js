const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const { campgroundSchema, reviewSchema } = require("./schemas"); //JOI offers validation for API based requests
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

//set up db connection
mongoose.connect("mongodb://localhost:27017/yelp-camp", {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("database connected");
});
//end db connection

//get the db models
const Review = require("./models/Review");
const Campground = require("./models/Campground");
//end get the db models

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//ensure that the body is parsed REVIEW THIS
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//Schema Validation
const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, msg);
	}
	else {
		next();
	}
};

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, msg);
	}
	else {
		next();
	}
};
//END Schema Validation

//ROUTES
app.get("/", (req, res) => {
	res.render("home");
});

app.get(
	"/campgrounds",
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find();
		res.render("campgrounds/index", { campgrounds });
	})
);

app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});

app.post(
	"/campgrounds",
	validateCampground,
	catchAsync(async (req, res, next) => {
		//if (!req.body.campground) throw new ExpressError(400, "Invalid Campground Data");

		const campground = new Campground(req.body.campground);
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

/***********
Remember to place the variable route last,
otherwise anything after will be treated as an ID
***********/
app.get(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate("reviews");
		res.render("campgrounds/show", { campground });
	})
);

app.get(
	"/campgrounds/:id/edit",
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		res.render("campgrounds/edit", { campground });
	})
);

app.put(
	"/campgrounds/:id",
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

app.delete(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		res.redirect("/campgrounds");
	})
);

app.post(
	"/campgrounds/:id/reviews",
	validateReview,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		const review = new Review(req.body.review);
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

app.delete(
	"/campgrounds/:id/reviews/:reviewId",
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;

		const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		const review = await Review.findByIdAndDelete(reviewId);
		res.redirect(`/campgrounds/${id}`);
	})
);
//END routes

// error handling
app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "Something went wrong";
	res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
	console.log("serving on port 3000");
});
// END error handling
