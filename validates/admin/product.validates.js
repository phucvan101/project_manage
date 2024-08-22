module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Please enter a title");
        res.redirect("back");
        return; // ngăn chặn chạy đoạn code dưới
    }
    next(); // middleware 
}
