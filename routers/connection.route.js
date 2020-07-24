const express = require("express");
const testConnectionDao = require("../company-daos/testConnection.dao");
const router = express.Router();
const sql_connection = require('mysql');

router.post("/", async (req, res) => {
    const dbInfo = req.body;
    try {
        var response = {
            employee: {},
            department: {},
            team: {},
            team_employee: {},
            checkConnection: {}
        }
        var check = await testConnectionDao.checkConnection(dbInfo);
        if (check === true) {
            response.checkConnection["status"] = check;
            const connectionString = sql_connection.createConnection({
                host: dbInfo.host,
                user: dbInfo.username,
                password: dbInfo.password,
                database: dbInfo.dbName,
                port: dbInfo.port,
                timestamps: false,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            })
            // connect db
            connectionString.connect(function (err) {
                if (err) throw err;
                console.log('error when connecting to db:', err);
            });
            // after connect, query get all information of tabel in db
            await connectionString.query('select * from information_schema.columns where table_schema = ' + '"' + dbInfo.dbName + '"' + ' order by table_name,ordinal_position', (err, result, fields) => {
                if (err) {
                    console.log(err);
                }
                for (var i = 0; i < result.length; i++) {
                    if (result[i].TABLE_NAME == "employee") {
                        response.employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    }
                    if (result[i].TABLE_NAME == "department") {
                        response.department[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    }
                    if (result[i].TABLE_NAME == "team") {
                        response.team[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    }
                    if (result[i].TABLE_NAME == "team_employee") {
                        response.team_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    }
                }


                connectionString.destroy(function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
                res.json(response);
            })
        }else{
            response.checkConnection["status"] = false;
            res.json(response);
        }



    } catch (err) {
        console.log(err);
        res.send("server error");
    }
});

module.exports = router;