const User = require('../../models/user.model')
const ForgotPassword = require('../../models/forgot-password.model')
const md5 = require('md5'); // mã hóa password
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require('../../helpers/sendMail')
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

// [GET] /user/forgotPassword
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgotPassword", {
        pageTitle: "Retrieve password",
    })
}

// [POST] /user/forgotPasswordPost
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        req.flash("error", "Email not found");
        res.redirect("back");
        return;
    }
    // Lưu thông tin bào DB
    const otp = generateHelper.generateRandomNumber(8);

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    };

    // console.log(objectForgotPassword);
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save();
    // nếu tồn tại email thì gửi mã OTP qua email 
    const subject = "Send code OTP authentication";
    const html = `
        OTP code to retrieve user password <b>${otp}</b>. The duration is 3 minutes.
    `;
    sendMailHelper.sendMail(email, subject, html);
    console.log(otp);
    res.redirect(`/user/password/otp?email=${email}`);
}

// [GET] /user/forgotPassword/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    const p = req.params;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Enter OTP",
        email: email
    })
}

// [POST] /user/forgotPassword/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if (!result) {
        req.flash('error', "OTP not found");
        res.redirect("back");
        return;
    }
    const user = await User.findOne({
        email: email,
    })
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Reset Password",
    })
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser //tìm tài khoản có token trùng với token trong database
    }, {
        password: md5(password) // cập nhập mật khẩu
    });
    req.flash('success', 'Passwords updated successfully')
    res.redirect('/');
}