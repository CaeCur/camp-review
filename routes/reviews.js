const express = require("express");
const router = express.Router({ mergeParams: true }); //mergeParams tells express not to seperate the campgorund id param
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn } = require("../middleware");
const ExpressError = require("../utils/ExpressError");

//get the DB models
const Review = require("../models/Review");
const Campground = require("../models/Campground");
//end get the DB models

//routes
router.post(
	"/",
	isLoggedIn,
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		review.author = req.user._id;
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		req.flash("success", "Created new review!");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	"/:reviewId",
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;

		const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		const review = await Review.findByIdAndDelete(reviewId);
		req.flash("success", "Successfully deleted review");
		res.redirect(`/campgrounds/${id}`);
	})
);
//END routes

module.exports = router;
