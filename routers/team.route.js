const express = require("express");
const router = express.Router();
const team_dao = require("../company-daos/team.dao");
const auth = require("../middleware/auth.middleware");

router.post("/", async (req, res) => {
    const db_info = req.body;
    console.log(JSON.stringify(db_info) + '111111111111111');
    
    try {
        const teams = await team_dao.findAllTeam(db_info);
        res.json(teams);
    } catch (err) {
        console.log(err.message);
        res.send("Server error");
    }
});


module.exports = router;