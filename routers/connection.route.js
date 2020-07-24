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
            checkConnection: {}
            // member: []
        }
        var check = await testConnectionDao.checkConnection(dbInfo);
        console.log("test: " + check);

        console.log(dbInfo);
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
            // setTimeout(checkConnection(dbInfo), 2000);
        });
        // on connect if db has been losed, we will reconnect
        // connectionString.on('error', function (err) {
        //     console.log('db error', err);
        //     if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        //         console.log(dbInfo);
        //         checkConnection(newConnection);
        //     } else {
        //         throw err;
        //     }
        // });
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
            }

            // if (result.length > 0) {
            connectionString.destroy(function (err) {
                if (err) {
                    console.log(err);
                }
            })
            res.json(response);
            // } else {


        })

    } catch (err) {
        console.log(err);
        res.send("server error");
    }
});

module.exports = router;