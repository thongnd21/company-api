const express = require("express");
const router = express.Router();
const employe_dao = require("../company-daos/employees.dao");

router.post("/", async (req, res) => {
    const db_info = req.body;
    try {
        const listEmp = await employe_dao.getAllEmployee(db_info);
        res.json(listEmp);
    } catch (err) {
        console.log(err);
        res.send("server error");
    }
});

module.exports = router;