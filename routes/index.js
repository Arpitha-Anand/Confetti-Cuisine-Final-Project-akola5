"use strict";


const router = require("express").Router(),
  userRoutes = require("./userRoutes"),
  subscriberRoutes = require("./subscriberRoutes"),
  courseRoutes = require("./courseRoutes"),
  errorRoutes = require("./errorRoutes"),
  homeRoutes = require("./homeRoutes"),
  apiRoutes = require("./apiRoutes"),
  culinaryVacations = require("./culinaryVacationsRoutes");

router.use("/api", apiRoutes);
router.use("/users", userRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/courses", courseRoutes);
router.use("/culinaryVacations",culinaryVacations);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;
