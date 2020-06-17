const express = require("express");
const testConnectionDao = require("../company-daos/testConnection.dao");
const router = express.Router();

router.post("/", async (req, res) => {
    const db_info = req.body;
    try {
        let connection;
        const check = await testConnectionDao.checkConnection(db_info);
        if(check === true){
            connection={
                status : 200,
                message: 'Connect to Database success!'
            }
        }else{
            connection={
                status : 0,
                message: 'Connection fail!!'
            }
        }
        res.json(connection);
    } catch (err) {
        console.log(err);
        res.send("server error");
    }
});

module.exports = router;