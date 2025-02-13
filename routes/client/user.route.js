const express = require("express")
const router = express.Router()

const controller = require("../../controller/client/user.controller")
const validate = require("../../validates/client/user.validate") // thêm validate để tránh trường hợp f12 xóa đi mà vẫn đăng nhập được 
const authMiddleware = require('../../middlewares/client/auth.middleware');
router.get('/register', controller.register)
router.post('/register', validate.registerPost, controller.registerPost)

router.get('/login', controller.login)
router.post('/login', validate.loginPost, controller.loginPost)

router.get('/logout', controller.logout)

router.get('/password/forgot', controller.forgotPassword)
router.post('/password/forgot', validate.forgotPassword, controller.forgotPasswordPost)

router.get('/password/otp', controller.otpPassword)
router.post('/password/otp', controller.otpPasswordPost)

router.get('/password/reset', controller.resetPassword)
router.post('/password/reset', validate.resetPassword, controller.resetPasswordPost)

router.get('/info', authMiddleware.requireAuth, controller.info)
module.exports = router