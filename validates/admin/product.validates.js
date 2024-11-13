module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Please enter a title");
        res.redirect("back");
        return; // ngăn chặn chạy đoạn code dưới
    }
    if (!req.body.product_category_id) {
        req.flash("error", "Please select a product category");
        res.redirect("back");
        return; // ngăn chặn chạy đoạn code dưới
    }
    if (!req.body.price) {
        req.flash("error", "Please enter a price");
        res.redirect("back");
        return; // ngăn chặn chạy đoạn code dưới
    }
    next(); // middleware 
}
