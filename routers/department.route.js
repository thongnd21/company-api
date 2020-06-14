const express = require("express");
const router = express.Router();
const department_dao = require("../company-daos/department.dao");
const auth = require("../middleware/auth.middleware");

router.post("/", async (req, res) => {
    const db_info = req.body;
    try {
        const departments = await department_dao.findAllDepartment(db_info);
        res.json(departments);
    } catch (err) {
        console.log(err.message);
        res.send("Server error");
    }
});

module.exports = router;