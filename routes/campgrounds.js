const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isAuthor } = require("../middleware");
const { campgroundSchema } = require("../schemas"); //JOI offers validation for API based requests

//get the db models
const Campground = require("../models/Campground");
//END get the db models

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
//END Schema Validation

//campgrounds routes
router.get(
	"",
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find();
		res.render("campgrounds/index", { campgrounds });
	})
);

router.get("/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

router.post(
	"/",
	isLoggedIn,
	validateCampground,
	catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground);
		campground.author = req.user._id;
		await campground.save();
		req.flash("success", "Successfully added campground");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

/***********
Remember to place the variable route last,
otherwise anything after will be treated as an ID
***********/
router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate("reviews").populate("author");
		if (!campground) {
			req.flash("error", "Campground can't be found");
			return res.redirect("/campgrounds"); //remember to return if you don't want to continue after condition
		}
		res.render("campgrounds/show", { campground });
	})
);

router.get(
	"/:id/edit",
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		if (!campground) {
			req.flash("error", "Campground can't be found");
			return res.redirect("/campgrounds"); //remember to return if you don't want to continue after condition
		}
		res.render("campgrounds/edit", { campground });
	})
);

router.put(
	"/:id",
	isLoggedIn,
	isAuthor,
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
		req.flash("success", "Successfully edited campground");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	"/:id",
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		req.flash("success", "Successfully deleted campground");
		res.redirect("/campgrounds");
	})
);

//END campgrounds routes

module.exports = router;
