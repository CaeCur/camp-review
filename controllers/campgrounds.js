const Campground = require("../models/Campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find();
	res.render("campgrounds/index", { campgrounds });
};

module.exports.getCreateForm = (req, res) => {
	res.render("campgrounds/new");
};

module.exports.postCreateForm = async (req, res) => {
	const campground = new Campground(req.body.campground);
	campground.images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
	campground.author = req.user._id;
	await campground.save();
	console.log(campground);
	req.flash("success", "Successfully added campground");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.getCampground = async (req, res) => {
	const campground = await Campground.findById(req.params.id)
		.populate({ path: "reviews", populate: { path: "author" } })
		.populate("author");
	if (!campground) {
		req.flash("error", "Campground can't be found");
		return res.redirect("/campgrounds"); //remember to return if you don't want to continue after condition
	}
	res.render("campgrounds/show", { campground });
};

module.exports.getUpdateCampground = async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	if (!campground) {
		req.flash("error", "Campground can't be found");
		return res.redirect("/campgrounds"); //remember to return if you don't want to continue after condition
	}
	res.render("campgrounds/edit", { campground });
};

module.exports.putUpdateCampground = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
	const imgs = req.files.map((file) => ({ url: file.path, filename: file.filename }));
	campground.images.push(...imgs);
	await campground.save();

	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
			console.log("Deleted cloudinary:", filename);
		}
		await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
		console.log("deleted DB:", campground.images);
	}

	req.flash("success", "Successfully edited campground");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "Successfully deleted campground");
	res.redirect("/campgrounds");
};
