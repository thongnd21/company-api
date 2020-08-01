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

        var structure = {
            employees: [],
            teams: [],
            departments: [],
            checkConnection: {
                status : '',
                message : ''
            }
        }
        var check = await testConnectionDao.checkConnection(dbInfo);
        if (check === true) {

            //get employees
            structure.checkConnection.status = "success";
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


        } else {
            // structure.checkConnection["status"] = false;
            if (check.original.code == "ER_DBACCESS_DENIED_ERROR") {
                structure.checkConnection.status = "fail";
                structure.checkConnection.message = "Wrong connection name, please input again!";
            }else if(check.original.code ==  "ENOTFOUND"){
                structure.checkConnection.status = "fail";
                structure.checkConnection.message = "Wrong host, please input again!";
            }else if(check.original.code ==  "ETIMEDOUT"){
                structure.checkConnection.status = "fail";
                structure.checkConnection.message = "Wrong port, please input again!";
            }else if(check.original.code ==  "ER_ACCESS_DENIED_ERROR"){
                structure.checkConnection.status = "fail";
                structure.checkConnection.message = "Wrong user name or password, please input again!";
            }else{
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