const express = require("express");
const router = express.Router();

router.use("/employees", require("./employee.route"));
router.use("/teams", require("./team.route"));
router.use("/departments", require("./department.route"));
router.use("/connection", require("./connection.route"));

module.exports = router;