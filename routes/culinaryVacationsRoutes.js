"use strict";

const router = require("express").Router(),
culinaryVacationsController = require("../controllers/culinaryVacationsController");

router.get("", culinaryVacationsController.index, culinaryVacationsController.indexView);
router.get("/new", culinaryVacationsController.new);
router.post("/create", culinaryVacationsController.create, culinaryVacationsController.redirectView);
router.get("/:id/edit", culinaryVacationsController.edit);
router.put("/:id/update", culinaryVacationsController.update, culinaryVacationsController.redirectView);
router.get("/:id", culinaryVacationsController.show, culinaryVacationsController.showView);
router.delete("/:id/delete", culinaryVacationsController.delete, culinaryVacationsController.redirectView);

module.exports = router;