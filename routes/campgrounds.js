const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
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
router.get("/", catchAsync(campgrounds.index));

router.get("/new", isLoggedIn, campgrounds.getCreateForm);

router.post("/", isLoggedIn, validateCampground, catchAsync(campgrounds.postCreateForm));

/***********
Remember to place the variable route last,
otherwise anything after will be treated as an ID
***********/
router.get("/:id", catchAsync(campgrounds.getCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.getUpdateCampground));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.putUpdateCampground));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//END campgrounds routes

module.exports = router;
