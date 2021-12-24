/*
This route file will not be refactored to the best effort so that it displays
an alternate unfactored solution to a clean routes file.
See one of the other route files for a display of properly factored files.

See users routes to see the router.route solution to routes refactoring
*/
const express = require("express");
const router = express.Router();
const Campgrounds = require("../controllers/Campgrounds");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
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

router.post("/", isLoggedIn, upload.array("image"), validateCampground, catchAsync(Campgrounds.postCreateForm));

router.get("/new", isLoggedIn, Campgrounds.getCreateForm);

/***********
Remember to place the variable route last,
otherwise anything after will be treated as an ID
***********/
router
	.route("/:id")
	.get(catchAsync(Campgrounds.getCampground))
	.put(isLoggedIn, isAuthor, validateCampground, catchAsync(Campgrounds.putUpdateCampground))
	.delete(isLoggedIn, isAuthor, catchAsync(Campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(Campgrounds.getUpdateCampground));

//END campgrounds routes

module.exports = router;
