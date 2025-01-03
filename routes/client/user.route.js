const express = require("express")
const router = express.Router()

const controller = require("../../controller/client/user.controller")
const validate = require("../../validates/client/user.validate") // thêm validate để tránh trường hợp f12 xóa đi mà vẫn đăng nhập được 

router.get('/register', controller.register)
router.post('/register', validate.registerPost, controller.registerPost)

router.get('/login', controller.login)
router.post('/login', validate.loginPost, controller.loginPost)

router.get('/logout', controller.logout)
module.exports = router