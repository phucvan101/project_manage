const express = require('express');
const router = express.Router();

const controller = require("../../controller/admin/role.controller")

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.createPost);
router.get("/detail/:id", controller.detail);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", controller.editPatch);
router.delete("/delete/:id", controller.delete);

router.get("/decentralization", controller.decentralization);
router.patch("/decentralization", controller.decentralizationPatch);
module.exports = router;