const express = require('express');
const multer = require("multer");
const router = express.Router();

const upload = multer();
const validate = require("../../validates/admin/products-category.validates");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controller/admin/products-category.controller")


router.get("/", controller.index);

router.get("/create", controller.create);
router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get(
    "/detail/:id",
    controller.detail
)

router.get("/edit/:id", controller.edit)
router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
)

router.delete("/delete/:id", controller.deleteItem)
module.exports = router;