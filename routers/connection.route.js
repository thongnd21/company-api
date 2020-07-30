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
            checkConnection: {}
        }
        var check = await testConnectionDao.checkConnection(dbInfo);
        if (check === true) {
          
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
            // structure.checkConnection["status"] = false;
            res.json(check);
            console.log(check);
        }
    } catch (err) {
        console.log(err);
        res.send("server error");
    }
});

module.exports = router;