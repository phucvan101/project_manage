const express = require('express');
const multer = require('multer');

const router = express.Router();
const validate = require("../../validates/admin/auth.validate")
const upload = multer();
const controller = require("../../controller/admin/my-account.controller")
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

router.get("/", controller.index)
router.get("/edit", controller.edit)
router.patch(
    "/edit",
    upload.single("avatar"),
    uploadCloud.upload,
    controller.editPatch,
)

module.exports = router;