const User = require('../../models/user.model')
const md5 = require('md5'); // mã hóa password
// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render('client/pages/user/register.pug', {
        pageTitle: "Register",
    })
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
    });
    if (existEmail) {
        req.flash("error", "Email already exists")
        res.redirect("back");
        return;
    }
    req.body.password = md5(req.body.password)
    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}

// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render('client/pages/user/login.pug', {
        pageTitle: "Login",
    })
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email: req.body.email,
        deleted: false
    })
    if (!user) {
        req.flash("error", "Email not exist!");
        res.redirect("back");
        return;
    }
    if (md5(password) !== user.password) {
        req.flash("error", "wrong password!");
        res.redirect("back");
        return;
    }
    if (user.status === "locked") {
        req.flash("error", "Account locked!");
        res.redirect("back");
        return;

    }

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}