const express = require("express");
const router = express.Router();
//model
const Employee = require("./../companyModels/Employees");
const Team = require("./../companyModels/Team");
const Department = require("./../companyModels/Department");
const Team_Employee = require("./../companyModels/Team_Employee");
const Position = require("./../companyModels/Positon");
const Vacation = require("./../companyModels/Vacation_Employee");
const Sequelize = require("sequelize");
const sequelize = require("sequelize");
const Op = Sequelize.Op;
const sql_connection = require('mysql');
const testConnectionDao = require("../company-daos/testConnection.dao");

// {
//     dbName: 'hrms',
//     host: '103.143.209.237',
//     port: '3306',
//     username: 'hrms',
//     password: 'Zz@123456',
//     dialect: 'mysql'
//   }
router.get('/', async (req, res) => {
    try {
        const dbInfo = {
            host: '',
            port: '',
            username: '',
            password: '',
            dialect: '',
            dbName: ''
        }
        dbInfo.host = req.query.host;
        dbInfo.port = req.query.port;
        dbInfo.username = req.query.username;
        dbInfo.password = req.query.password;
        dbInfo.dialect = req.query.dialect;
        dbInfo.dbName = req.query.dbName;
        // dbInfo.dbInfo = req.query;
        var check = await testConnectionDao.checkConnection(dbInfo);
        if (check === true) {

            //get employees
            // structure.checkConnection.status = "success";
            const connectionString = new Sequelize(dbInfo.dbName, dbInfo.username, dbInfo.password, {
                host: dbInfo.host,
                dialect: dbInfo.dialect,
                port: dbInfo.port,
                timestamps: false,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            })
            const emp = Employee.EmpModel(connectionString);
            const team =  Team.TeamModel(connectionString);
            const dep =  Department.DepModel(connectionString);
            const pos =  Position.PositionModel(connectionString);
            const vac =  Vacation.VacationEmployeModel(connectionString);
            const team_emp =  Team_Employee.EmpTeamModel(connectionString, team, emp);
            var structure = {
                employees: [],
                teams: [],
                departments: [],
                positions: []
            }
            //get employees
            var employeeResponse = await emp.findAll({
                attributes: ['id', 'primary_email', 'personal_email',
                    'first_name', 'last_name', 'modified_date', 'address', 'position_id',
                    'department_id', 'phone', 'status_id', 'vacation_start_date', 'vacation_end_date'],
                include: [
                    {
                        model: dep,
                        as: 'department',
                        attributes: ['id', 'name', 'email'],
                    },
                    {
                        model: team_emp,
                        as: 'teams',
                        attributes: ['team_id'],
                        order: [
                            ['team_id', 'ASC']
                        ]
                    },
                    {
                        model: pos,
                        as: 'position',
                        attributes: ['id', 'name'],
                    },
                ],
                order: [
                    ['primary_email', 'ASC']
                ],
                where: { status_id: 1 }
            });
    
            const sql = "SELECT id, created_date, employee_id, start_date, end_date FROM vacation_date AS vacation_date WHERE (current_date() between date(vacation_date.start_date) and date(vacation_date.end_date)) OR date(vacation_date.start_date) >= current_date() ORDER BY vacation_date.start_date DESC";
            const vacation = await vac.sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
            // console.log(today.toISOString().substring(0, 10));
            if (vacation.length > 0) {
                for (let i = 0; i < employeeResponse.length; i++) {
                    for (let j = 0; j < vacation.length; j++) {
                        if (employeeResponse[i].id === vacation[j].employee_id) {
                            employeeResponse[i].vacation_start_date = vacation[j].start_date;
                            employeeResponse[i].vacation_end_date = vacation[j].end_date;
                        }
                    }
                }
            }
            console.log("----Get all employee from HRMS---");
    
            structure.employees = employeeResponse;
    
            var teamResponse = await team.findAll({
                include: [
                    {
                        attributes: ['employee_id', 'modified_date'],
                        model: team_emp,
                        as: 'members',
                        include: [
                            {
                                attributes: ['primary_email', ['id', 'employee_id']],
                                model: emp,
                                as: 'employee',
                                order: [['id', 'ASC']],
                                // where: { status_id: 1 }
    
                            }
                        ]
                    }],
                where: {
                    status_id: 1
                },
                order: [['email', "ASC"]]
            }
            );
    
            structure.teams = [...structure.teams, ...teamResponse];
    
            // get derpartments
            var departmentResponse = await dep.findAll({
                where: {
                    status_id: 1
                },
                order: [['name', "ASC"]]
            });
            await departmentResponse.map(item => {
                structure.departments.push(item);
            })
            var positionResponse = await pos.findAll({
                order: [['name', 'ASC']]
            });
            structure.positions = positionResponse;
    
    
            res.json(structure);
        } 
    }catch (error) {
            res.status(500).json("System error!" + error)
        }
    });
    
    module.exports = router;