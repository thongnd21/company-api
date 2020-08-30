const express = require("express");
const testConnectionDao = require("../company-daos/testConnection.dao");
const router = express.Router();
const sql_connection = require('mysql');
const employee = require('../companyModels/Employees');
const department = require('../companyModels/Department');
const team = require('../companyModels/Team');
const team_employee = require('../companyModels/Team_Employee');
const employee_dao = require('../company-daos/employees.dao');
const department_dao = require('../company-daos/department.dao');
const team_dao = require('../company-daos/team.dao');
const position = require('../company-daos/position.dao');

router.post("/", async (req, res) => {
    const dbInfo = req.body;
    try {

        var structure = {
            employees: {},
            teams: {},
            departments: {},
            positions: {},
            team_employee: {},
            vacation_date: {},
            checkConnection: {
                status: '',
                message: ''
            }
        }
        console.log(dbInfo);
        var check = await testConnectionDao.checkConnection(dbInfo);
        if (check === true) {

            //get employees
            structure.checkConnection.status = "success";
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
            await connectionString.connect(function (err) {
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
                console.log(result[1]);
                for (var i = 0; i < result.length; i++) {
                    if (result[i].TABLE_NAME == "employee") {
                        structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    }
                    if (result[i].TABLE_NAME == "department") {
                        structure.departments[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    }
                    if (result[i].TABLE_NAME == "team") {
                        structure.teams[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    }
                    if (result[i].TABLE_NAME == "team_employee") {
                        structure.team_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    }
                    if (result[i].TABLE_NAME == "position") {
                        structure.positions[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    }
                    if (result[i].TABLE_NAME == "vacation_date") {
                        structure.vacation_date[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    }
                }


                connectionString.destroy(function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
                console.log(structure);
                res.json(structure);
                return;
            })


        } else {
            // structure.checkConnection["status"] = false;
            if (check.original.code == "ER_DBACCESS_DENIED_ERROR") {
                structure.checkConnection.status = "fail";
                structure.checkConnection.message = "Wrong connection name, please input again!";
            } else if (check.original.code == "ENOTFOUND") {
                structure.checkConnection.status = "fail";
                structure.checkConnection.message = "Wrong host, please input again!";
            } else if (check.original.code == "ETIMEDOUT") {
                structure.checkConnection.status = "fail";
                structure.checkConnection.message = "Wrong port, please input again!";
            } else if (check.original.code == "ER_ACCESS_DENIED_ERROR") {
                structure.checkConnection.status = "fail";
                structure.checkConnection.message = "Wrong user name or password, please input again!";
            } else {
                structure.checkConnection.status = "fail";
                structure.checkConnection.message = "Can not connect, please input again!";
            }
            res.json(structure);
            // console.log(check);
        }
    } catch (err) {
        console.log(err);
        res.send("server error");
    }
});

module.exports = router;