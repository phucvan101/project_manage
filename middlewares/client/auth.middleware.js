
const User = require("../../models/user.model")


module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.tokenUser) {
        res.redirect(`/user/login`)
        // res.redirect('back')
    } else {
        // console.log(req.cookies.tokenUser)
        const user = await User.findOne({ tokenUser: req.cookies.tokenUser }).select('-password');
        if (!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
        } else {
            res.locals.user = user;
            next();
        }
    }
}