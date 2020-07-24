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

router.post("/", async (req, res) => {
    const dbInfo = req.body;
    try {
        // var response = {
        //     employee: {},
        //     department: {},
        //     team: {},
        //     team_employee: {},
        //     checkConnection: {}
        // }
        var structure = {
            employees: [],
            teams: [],
            departments: [],
            checkConnection: {}
        }
        var check = await testConnectionDao.checkConnection(dbInfo);
        if (check === true) {
            // response.checkConnection["status"] = check;
            // const connectionString = sql_connection.createConnection({
            //     host: dbInfo.host,
            //     user: dbInfo.username,
            //     password: dbInfo.password,
            //     database: dbInfo.dbName,
            //     port: dbInfo.port,
            //     timestamps: false,
            //     pool: {
            //         max: 5,
            //         min: 0,
            //         acquire: 30000,
            //         idle: 10000
            //     }
            // })
            // connect db
            // connectionString.connect(function (err) {
            //     if (err) throw err;
            //     console.log('error when connecting to db:', err);
            // });
            // after connect, query get all information of tabel in db
            //     await connectionString.query('select * from information_schema.columns where table_schema = ' + '"' + dbInfo.dbName + '"' + ' order by table_name,ordinal_position', (err, result, fields) => {
            //         if (err) {
            //             console.log(err);
            //         }
            //         for (var i = 0; i < result.length; i++) {
            //             if (result[i].TABLE_NAME == "employee") {
            //                 response.employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
            //             }
            //             if (result[i].TABLE_NAME == "department") {
            //                 response.department[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
            //             }
            //             if (result[i].TABLE_NAME == "team") {
            //                 response.team[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
            //             }
            //             if (result[i].TABLE_NAME == "team_employee") {
            //                 response.team_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
            //             }
            //         }


            //         connectionString.destroy(function (err) {
            //             if (err) {
            //                 console.log(err);
            //             }
            //         })
            //         res.json(response);
            //     })
            // }else{
            //     response.checkConnection["status"] = false;
            //     res.json(response);
            // }
            
            //get employees
            structure.checkConnection["status"] = true;
            var employeeResponse = await employee_dao.getAllEmployeeToCheck(dbInfo);
            console.log("----Get all employee from HRMS---");
    
            structure.employees = [...structure.employees, ...employeeResponse];
    
            var teamResponse = await team_dao.findAllTeamToCheck(dbInfo);
    
            structure.teams = [...structure.teams, ...teamResponse];
    
            // get derpartments
            var departmentResponse = await department_dao.findAllDepartmentToCheck(dbInfo);
            await departmentResponse.map(item => {
                structure.departments.push(item);
            })
    
    
            res.json(structure);


        }else {
            structure.checkConnection["status"] = false;
            res.json(structure);
        }
    } catch (err) {
        console.log(err);
        res.send("server error");
    }
});

module.exports = router;