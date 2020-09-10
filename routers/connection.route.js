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
const mssql = require('mssql');

router.post("/", async (req, res) => {
    const dbInfo = req.body;
    try {

        var structure = {
            table: null,
            checkConnection: {
                status: '',
                message: ''
            }
        }
        console.log(dbInfo);
        if (dbInfo.dialect == "mssql" && dbInfo.port == "3306") {
            structure.checkConnection.status = "fail";
            structure.checkConnection.message = "Wrong port, please input again!";
            res.json(structure);
            return;
        }
        var check = await testConnectionDao.checkConnection(dbInfo);
        if (check === true) {

            //get employees
            structure.checkConnection.status = "success";
            if (dbInfo.dialect == "mysql") {
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
                    // for (var i = 0; i < result.length; i++) {
                    //     if (result[i].TABLE_NAME == "gmhrs_employee_view") {
                    //         if (result[i].COLUMN_NAME == "primary_email" && result[i].CHARACTER_MAXIMUM_LENGTH <= 254) {
                    //             structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         } else if (result[i].COLUMN_NAME == "primary_email" && result[i].CHARACTER_MAXIMUM_LENGTH > 254) {
                    //             structure.character_maximum_length_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }

                    //         if (result[i].COLUMN_NAME == "personal_email" && result[i].CHARACTER_MAXIMUM_LENGTH <= 254) {
                    //             structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         } else if (result[i].COLUMN_NAME == "personal_email" && result[i].CHARACTER_MAXIMUM_LENGTH > 254) {
                    //             structure.character_maximum_length_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }

                    //         if (result[i].COLUMN_NAME == "phone" && result[i].CHARACTER_MAXIMUM_LENGTH <= 15) {
                    //             structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         } else if (result[i].COLUMN_NAME == "phone" && result[i].CHARACTER_MAXIMUM_LENGTH > 15) {
                    //             structure.character_maximum_length_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }

                    //         if (result[i].COLUMN_NAME == "first_name" && result[i].CHARACTER_MAXIMUM_LENGTH <= 45) {
                    //             structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         } else if (result[i].COLUMN_NAME == "first_name" && result[i].CHARACTER_MAXIMUM_LENGTH > 45) {
                    //             structure.character_maximum_length_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }

                    //         if (result[i].COLUMN_NAME == "last_name" && result[i].CHARACTER_MAXIMUM_LENGTH <= 45) {
                    //             structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         } else if (result[i].COLUMN_NAME == "last_name" && result[i].CHARACTER_MAXIMUM_LENGTH > 45) {
                    //             structure.character_maximum_length_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }

                    //         if (result[i].COLUMN_NAME == "address" && result[i].CHARACTER_MAXIMUM_LENGTH <= 512) {
                    //             structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         } else if (result[i].COLUMN_NAME == "address" && result[i].CHARACTER_MAXIMUM_LENGTH > 512) {
                    //             structure.character_maximum_length_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }

                    //         if (result[i].COLUMN_NAME == "position_id") {
                    //             structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }

                    //         if (result[i].COLUMN_NAME == "department_id") {
                    //             structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }

                    //         if (result[i].COLUMN_NAME == "id") {
                    //             structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }
                    //     }
                    //     if (result[i].TABLE_NAME == "gmhrs_department_view") {
                    //         if (result[i].COLUMN_NAME == "id") {
                    //             structure.departments[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }

                    //         if (result[i].COLUMN_NAME == "name" && result[i].CHARACTER_MAXIMUM_LENGTH <= 200) {
                    //             structure.departments[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         } else if (result[i].COLUMN_NAME == "name" && result[i].CHARACTER_MAXIMUM_LENGTH > 200) {
                    //             structure.character_maximum_length_department[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }

                    //         if (result[i].COLUMN_NAME == "email" && result[i].CHARACTER_MAXIMUM_LENGTH <= 254) {
                    //             structure.departments[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         } else if (result[i].COLUMN_NAME == "email" && result[i].CHARACTER_MAXIMUM_LENGTH > 254) {
                    //             structure.character_maximum_length_department[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }
                    //     }
                    //     if (result[i].TABLE_NAME == "gmhrs_team_view") {
                    //         if (result[i].COLUMN_NAME == "id") {
                    //             structure.teams[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }

                    //         if (result[i].COLUMN_NAME == "name" && result[i].CHARACTER_MAXIMUM_LENGTH <= 200) {
                    //             structure.teams[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         } else if (result[i].COLUMN_NAME == "name" && result[i].CHARACTER_MAXIMUM_LENGTH > 200) {
                    //             structure.character_maximum_length_team[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }

                    //         if (result[i].COLUMN_NAME == "email" && result[i].CHARACTER_MAXIMUM_LENGTH <= 254) {
                    //             structure.teams[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         } else if (result[i].COLUMN_NAME == "email" && result[i].CHARACTER_MAXIMUM_LENGTH > 254) {
                    //             structure.character_maximum_length_team[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }
                    //     }
                    //     if (result[i].TABLE_NAME == "gmhrs_team_employee_view") {
                    //         structure.team_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //     }
                    //     if (result[i].TABLE_NAME == "gmhrs_position_view") {
                    //         if (result[i].COLUMN_NAME == "id") {
                    //             structure.positions[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }

                    //         if (result[i].COLUMN_NAME == "name" && result[i].CHARACTER_MAXIMUM_LENGTH <= 200) {
                    //             structure.positions[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         } else if (result[i].COLUMN_NAME == "name" && result[i].CHARACTER_MAXIMUM_LENGTH > 200) {
                    //             structure.character_maximum_length_position[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //         }
                    //     }
                    //     if (result[i].TABLE_NAME == "gmhrs_vacation_date_view") {
                    //         structure.vacation_date[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                    //     }
                    // }



                    var listTable = [];
                    var listTableName = [];
                    let tableNameMap = new Map();
                    for (let i = 0; i < result.length; i++) {
                        tableNameMap.set(result[i].TABLE_NAME, result[i].TABLE_NAME);
                    }
                    listTableName = Array.from(tableNameMap.values());

                    for (let j = 0; j < listTableName.length; j++) {
                        var table = {
                            tableName: null,
                            fields: []
                        };
                        table.tableName = listTableName[j];
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].TABLE_NAME === listTableName[j]) {
                                // let tableName = result[i].TABLE_NAME;
                                var field = {
                                    name: null,
                                    length: null,
                                    type: null
                                }
                                field.name = result[i].COLUMN_NAME;
                                field.length = result[i].CHARACTER_MAXIMUM_LENGTH;
                                field.type = result[i].COLUMN_TYPE;
                                table.fields.push(field);
                            }

                        }
                        // tableName[result[i].TABLE_NAME];
                        listTable.push(table);
                    }

                    structure.table = listTable;
                    // console.log("tables: ");
                    // console.log(listTable);
                    // for (let i = 0; i < result.length; i++) {
                    //     if (tableName[result[i].TABLE_NAME] = result[i].TABLE_NAME) {
                    //         tableName[result[i].TABLE_NAME][result[i].COLUMN_NAME] = result[i].COLUMN_NAME
                    //     }

                    // }

                    connectionString.destroy(function (err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                    // console.log(tableName);
                    res.json(structure);
                    return;
                })


            } else {
                // structure.checkConnection["status"] = false;
                var config = {
                    user: dbInfo.username,
                    password: dbInfo.password,
                    server: dbInfo.host,
                    database: dbInfo.dbName
                };

                // connect to your database
                mssql.connect(config, function (err) {

                    if (err) console.log(err);

                    // create Request object
                    var request = new mssql.Request();

                    // query to the database and get the records
                    request.query('select table_name, column_name, character_maximum_length from information_schema.columns  order by table_name,ordinal_position', function (err, recordset) {

                        if (err) console.log(err)

                        // send records as a response
                        console.log(recordset);
                        // for (var i = 0; i < recordset.length; i++) {
                        //     if (recordset[i].table_name == "gmhrs_employee_view") {
                        //         if (recordset[i].column_name == "primary_email" && recordset[i].character_maximum_length <= 254) {
                        //             structure.employees[result[i].COLUMN_NAME] = (recordset[i].column_name)
                        //         } else if (recordset[i].column_name == "primary_email" && recordset[i].character_maximum_length > 254) {
                        //             structure.character_maximum_length_employee[recordset[i].column_name] = (recordset[i].column_name)
                        //         }

                        //         if (recordset[i].column_name == "personal_email" && recordset[i].character_maximum_length <= 254) {
                        //             structure.employees[recordset[i].column_name] = (recordset[i].column_name)
                        //         } else if (recordset[i].column_name == "personal_email" && recordset[i].character_maximum_length > 254) {
                        //             structure.character_maximum_length_employee[recordset[i].column_name] = (recordset[i].column_name)
                        //         }

                        //         if (recordset[i].column_name == "phone" && recordset[i].character_maximum_length <= 15) {
                        //             structure.employees[result[i].COLUMN_NAME] = (recordset[i].column_name)
                        //         } else if (recordset[i].column_name == "phone" && recordset[i].character_maximum_length > 15) {
                        //             structure.character_maximum_length_employee[recordset[i].column_name] = (recordset[i].column_name)
                        //         }

                        //         if (recordset[i].column_name == "first_name" && recordset[i].character_maximum_length <= 45) {
                        //             structure.employees[recordset[i].column_name] = (recordset[i].column_name)
                        //         } else if (recordset[i].column_name == "first_name" && recordset[i].character_maximum_length > 45) {
                        //             structure.character_maximum_length_employee[recordset[i].column_name] = (recordset[i].column_name)
                        //         }

                        //         if (recordset[i].column_name == "last_name" && recordset[i].character_maximum_length <= 45) {
                        //             structure.employees[recordset[i].column_name] = (recordset[i].column_name)
                        //         } else if (recordset[i].column_name == "last_name" && recordset[i].character_maximum_length > 45) {
                        //             structure.character_maximum_length_employee[recordset[i].column_name] = (recordset[i].column_name)
                        //         }

                        //         if (recordset[i].column_name == "address" && recordset[i].character_maximum_length <= 512) {
                        //             structure.employees[recordset[i].column_name] = (recordset[i].column_name)
                        //         } else if (recordset[i].column_name == "address" && recordset[i].character_maximum_length > 512) {
                        //             structure.character_maximum_length_employee[recordset[i].column_name] = (recordset[i].column_name)
                        //         }

                        //         if (recordset[i].column_name == "position_id") {
                        //             structure.employees[recordset[i].column_name] = (recordset[i].column_name)
                        //         }

                        //         if (recordset[i].column_name == "department_id") {
                        //             structure.employees[recordset[i].column_name] = (recordset[i].column_name)
                        //         }

                        //         if (recordset[i].column_name == "id") {
                        //             structure.employees[recordset[i].column_name] = (recordset[i].column_name)
                        //         }
                        //     }
                        //     if (recordset[i].table_name == "gmhrs_department_view") {
                        //         if (recordset[i].column_name == "id") {
                        //             structure.departments[recordset[i].column_name] = (recordset[i].column_name)
                        //         }

                        //         if (recordset[i].column_name == "name" && recordset[i].character_maximum_length <= 200) {
                        //             structure.departments[recordset[i].column_name] = (recordset[i].column_name)
                        //         } else if (recordset[i].column_name == "name" && recordset[i].character_maximum_length > 200) {
                        //             structure.character_maximum_length_department[recordset[i].column_name] = (recordset[i].column_name)
                        //         }

                        //         if (recordset[i].column_name == "email" && recordset[i].character_maximum_length <= 254) {
                        //             structure.departments[recordset[i].column_name] = (recordset[i].column_name)
                        //         } else if (recordset[i].column_name == "email" && recordset[i].character_maximum_length > 254) {
                        //             structure.character_maximum_length_department[recordset[i].column_name] = (recordset[i].column_name)
                        //         }
                        //     }
                        //     if (recordset[i].table_name == "gmhrs_team_view") {
                        //         if (recordset[i].column_name == "id") {
                        //             structure.teams[recordset[i].column_name] = (recordset[i].column_name)
                        //         }

                        //         if (recordset[i].column_name == "name" && recordset[i].character_maximum_length <= 200) {
                        //             structure.teams[recordset[i].column_name] = (recordset[i].column_name)
                        //         } else if (recordset[i].column_name == "name" && recordset[i].character_maximum_length > 200) {
                        //             structure.character_maximum_length_team[recordset[i].column_name] = (recordset[i].column_name)
                        //         }

                        //         if (recordset[i].column_name == "email" && recordset[i].character_maximum_length <= 254) {
                        //             structure.teams[recordset[i].column_name] = (recordset[i].column_name)
                        //         } else if (recordset[i].column_name == "email" && recordset[i].character_maximum_length > 254) {
                        //             structure.character_maximum_length_team[recordset[i].column_name] = (recordset[i].column_name)
                        //         }
                        //     }
                        //     if (recordset[i].table_name == "gmhrs_team_employee_view") {
                        //         structure.team_employee[recordset[i].column_name] = (recordset[i].column_name)
                        //     }
                        //     if (recordset[i].table_name == "gmhrs_position_view") {
                        //         if (recordset[i].column_name == "id") {
                        //             structure.positions[recordset[i].column_name] = (recordset[i].column_name)
                        //         }

                        //         if (recordset[i].column_name == "name" && recordset[i].character_maximum_length <= 200) {
                        //             structure.positions[recordset[i].column_name] = (recordset[i].column_name)
                        //         } else if (recordset[i].column_name == "name" && recordset[i].character_maximum_length > 200) {
                        //             structure.character_maximum_length_position[recordset[i].column_name] = (recordset[i].column_name)
                        //         }
                        //     }
                        //     if (recordset[i].table_name == "gmhrs_vacation_date_view") {
                        //         structure.vacation_date[recordset[i].column_name] = (recordset[i].column_name)
                        //     }
                        // }
                    });
                });
                res.json(structure);
            }
        } else if (check !== true && dbInfo.dialect == "mysql") {
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
        } else if (check !== true && dbInfo.dialect == "mssql") {
            if (check.original.code == "ELOGIN") {
                structure.checkConnection.status = "fail";
                structure.checkConnection.message = "Wrong database name, please input again!";
            } else if (check.original.code == "ESOCKET") {
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
        }

        // console.log(check);
    }
    catch (err) {
        console.log(err);
        res.send("server error");
    }
});



router.put("/", async (req, res) => {
    const dbInfo = {
        dbName: 'hrms',
        host: '103.143.209.237',
        port: '3306',
        username: 'hrms',
        password: 'Zz@123456',
        dialect: 'mysql'
    }
    var mappingResult = [
        {
            tableGM: "gmhrs_employee_view",
            tableHR:
            {
                nametableHR: "gmhrs_employee_view",
                fields: [
                    { id: "" },
                    { primary_email: "" },
                    { personal_email: "" },
                    { first_name: "" },
                    { last_name: "" },
                    { phone: "" },
                    { address: "" },
                    { position_id: "" },
                    { department_id: "" }
                ]

            }
        },
        {
            tableGM: "gmhrs_department_view",
            tableHR:
            {
                nametableHR: "",
                fields: [
                    { id: "" },
                    { name: "" },
                    { email: "" }
                ]
            }
        },
        {
            tableGM: "gmhrs_team_view",
            tableHR:
            {
                nametableHR: "",
                fields: [
                    { id: "" },
                    { name: "" },
                    { email: "" }
                ]
            }
        },
        {
            tableGM: "gmhrs_team_employee_view",
            tableHR:
            {
                nametableHR: "",
                fields: [
                    { employee_id: "" },
                    { team_id: "" },
                ]
            }
        },
        {
            tableGM: "gmhrs_position_view",
            tableHR:
            {
                nametableHR: "",
                fields: [
                    { id: "" },
                    { name: "" }
                ]
            }
        },
        {
            tableGM: "gmhrs_vacation_date_view",
            tableHR:
            {
                nametableHR: "",
                fields: [
                    { employee_id: "" },
                    { start_date: "" },
                    { end_date: "" }
                ]

            }
        }
    ]
    console.log(req.body);
    try {
        var check = await testConnectionDao.checkConnection(dbInfo);
        console.log(check);
        if (check === true) {
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


            var empQuery = " SELECT employee.id, employee.primary_email, employee.personal_email, employee.first_name, employee.last_name, " +
                "employee.modified_date, employee.address, employee.position_id, employee.department_id, employee.phone, employee.status_id, " +
                "employee.vacation_start_date, employee.vacation_end_date, department.id AS 'department.id', department.name AS 'department.name', " +
                "department.email AS 'department.email' , position.id AS 'position.id' , position.name AS 'position.name' , teams.employee_id " +
                "AS 'teams.employee_id', teams.team_id AS 'teams.team_id' " +
                "FROM " + mappingResult[0].tableHR.nametableHR + " AS employee " +
                "LEFT OUTER JOIN " + mappingResult[1].tableHR.nametableHR + " AS department ON employee.department_id = department.id " +
                "LEFT OUTER JOIN " + mappingResult[4].tableHR.nametableHR + " AS position ON employee.position_id = position.id " +
                "LEFT OUTER JOIN " + mappingResult[3].tableHR.nametableHR + " AS teams ON employee.id = teams.employee_id " +
                "WHERE employee.status_id = 1 ORDER BY employee.primary_email ASC; "

            console.log(empQuery);
            // 'SELECT' + 'employee'+'.'+`id`+','+ `employee`+'.'+'primary_email'+','+ 'employee'+'.'+'personal_email'+','+'employee'+'.'+'first_name'+','+ 
            // 'employee'+'.'+'last_name'+','+`employee`.`modified_date`, `employee`.`address`, `employee`.`position_id`, `employee`.`department_id`, `employee`.`phone`, `employee`.`status_id`, `employee`.`vacation_start_date`, `employee`.`vacation_end_date`, `department`.`id` AS`department.id`, `department`.`name` AS`department.name`, `department`.`email` AS`department.email`, `position`.`id` AS`position.id`, `position`.`name` AS`position.name`, `teams`.`employee_id` AS`teams.employee_id`, `teams`.`team_id` AS`teams.team_id` FROM`employee` AS`employee` LEFT OUTER JOIN`department` AS`department` ON`employee`.`department_id` = `department`.`id` LEFT OUTER JOIN`position` AS`position` ON`employee`.`position_id` = `position`.`id` LEFT OUTER JOIN`team_employee` AS`teams` ON`employee`.`id` = `teams`.`employee_id` WHERE`employee`.`status_id` = 1 ORDER BY`employee`.`primary_email` ASC;

            // await connectionString.query(empQuery, (err, result, fields) => {
            //     if (err) {
            //         console.log(err);
            //     }
            //     console.log(result);
            //     connectionString.destroy(function (err) {
            //         if (err) {
            //             console.log(err);
            //         }
            //     })
            //     // console.log(tableName);
            //     return;
            // })
        }
    } catch (error) {
        console.log(error);
        res.send("Server unavailable!")
    }



})
module.exports = router;