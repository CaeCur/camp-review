/*
This route file will not be refactored to the best effort so that it displays
an alternate unfactored solution to a clean routes file.
See one of the other route files for a display of properly factored files.
*/
const express = require("express");
const router = express.Router();
const Campgrounds = require("../controllers/Campgrounds");
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
router.get("/", catchAsync(Campgrounds.index));

router.get("/new", isLoggedIn, Campgrounds.getCreateForm);

router.post("/", isLoggedIn, validateCampground, catchAsync(Campgrounds.postCreateForm));

/***********
Remember to place the variable route last,
otherwise anything after will be treated as an ID
***********/
router.get("/:id", catchAsync(Campgrounds.getCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(Campgrounds.getUpdateCampground));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(Campgrounds.putUpdateCampground));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(Campgrounds.deleteCampground));

//END campgrounds routes

module.exports = router;
