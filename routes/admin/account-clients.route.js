const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer();

const controller = require("../../controller/admin/account-clients.controller")

const validate = require("../../validates/admin/account.validate")

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

router.get('/', controller.index)

router.get('/create', controller.create)
router.post('/create', validate.createPost, controller.createPost)

router.get('/detail/:id', controller.detail);

router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', controller.editPatch);

router.delete('/delete/:id', controller.deleteAccountClient)

module.exports = router;