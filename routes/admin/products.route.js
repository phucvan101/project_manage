const express = require('express');
const multer = require('multer'); // thư viện upload ảnh
const storageMulter = require("../../helpers/storageMulter")
const upload = multer({ storage: storageMulter() })
const router = express.Router();

const controller = require("../../controller/admin/products.controller")

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create)
router.post("/create", upload.single("thumbnail"), controller.createPost)
module.exports = router;