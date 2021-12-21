const express = require("express");
const router = express.Router({ mergeParams: true }); //mergeParams tells express not to seperate the campgorund id param
const reviews = require("../controllers/reviews");
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const ExpressError = require("../utils/ExpressError");

//get the DB models
const Review = require("../models/Review");
const Campground = require("../models/Campground");
//end get the DB models

//routes
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.postCreateReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));
//END routes

module.exports = router;
