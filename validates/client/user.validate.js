// conditions check register 
module.exports.registerPost = (req, res, next) => {
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

// condition check login 
module.exports.loginPost = (req, res, next) => {
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

// condition check forgotPassword 
module.exports.forgotPassword = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Please enter a email");
        res.redirect("back");
        return; // ngăn chặn chạy đoạn code dưới
    }
    next(); // middleware 
}


// condition check resetPassword 
module.exports.resetPassword = (req, res, next) => {
    if (req.body.password != req.body.confirmPassword) {
        req.flash('error', 'Password is different')
        res.redirect('back')
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash("error", "Please enter a confirmPassword");
        res.redirect("back");
        return; // ngăn chặn chạy đoạn code dưới
    }
    if (!req.body.password) {
        req.flash("error", "Please enter a password");
        res.redirect("back");
        return; // ngăn chặn chạy đoạn code dưới
    }

    next();
} 
