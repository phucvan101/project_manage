module.exports.createPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Please enter a full name");
        res.redirect("back");
        return; // ngăn chặn chạy đoạn code dưới
    }
    if (!req.body.email) {
        req.flash("error", "Please enter a email");
        res.redirect("back");
        return; // ngăn chặn chạy đoạn code dưới
    }
    if (!req.body.password) {
        req.flash("error", "Please enter a password");
        res.redirect("back");
        return; // ngăn chặn chạy đoạn code dưới
    }
    next(); // middleware 
}

module.exports.editPatch = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Please enter a full name");
        res.redirect("back");
        return; // ngăn chặn chạy đoạn code dưới
    }
    if (!req.body.email) {
        req.flash("error", "Please enter a email");
        res.redirect("back");
        return; // ngăn chặn chạy đoạn code dưới
    }
    next(); // middleware 
}
