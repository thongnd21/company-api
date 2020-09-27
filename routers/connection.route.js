const express = require("express");
const testConnectionDao = require("../company-daos/testConnection.dao");
const router = express.Router();
const sql_connection = require('mysql');
const mysql = require('mysql');
const employee = require('../companyModels/Employees');
const department = require('../companyModels/Department');
const team = require('../companyModels/Team');
const team_employee = require('../companyModels/Team_Employee');
const employee_dao = require('../company-daos/employees.dao');
const department_dao = require('../company-daos/department.dao');
const team_dao = require('../company-daos/team.dao');
const position = require('../company-daos/position.dao');
const mssql = require('mssql');
const crypto = require('crypto-js');

const contants = require('./../contants/contants');
const deCrypt = require('./../common-encrypt-decrypt/de')

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
            character_maximum_length_employee: {},
            character_maximum_length_department: {},
            character_maximum_length_team: {},
            character_maximum_length_position: {},
            table: [],
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

                    //check valid database
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].TABLE_NAME == "gmhrs_employee_view") {
                            if (result[i].COLUMN_NAME == "primary_email" && result[i].CHARACTER_MAXIMUM_LENGTH <= 254) {
                                structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            } else if (result[i].COLUMN_NAME == "primary_email" && result[i].CHARACTER_MAXIMUM_LENGTH > 254) {
                                structure.character_maximum_length_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }

                            if (result[i].COLUMN_NAME == "personal_email" && result[i].CHARACTER_MAXIMUM_LENGTH <= 254) {
                                structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            } else if (result[i].COLUMN_NAME == "personal_email" && result[i].CHARACTER_MAXIMUM_LENGTH > 254) {
                                structure.character_maximum_length_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }

                            if (result[i].COLUMN_NAME == "phone" && result[i].CHARACTER_MAXIMUM_LENGTH <= 15) {
                                structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            } else if (result[i].COLUMN_NAME == "phone" && result[i].CHARACTER_MAXIMUM_LENGTH > 15) {
                                structure.character_maximum_length_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }

                            if (result[i].COLUMN_NAME == "first_name" && result[i].CHARACTER_MAXIMUM_LENGTH <= 45) {
                                structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            } else if (result[i].COLUMN_NAME == "first_name" && result[i].CHARACTER_MAXIMUM_LENGTH > 45) {
                                structure.character_maximum_length_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }

                            if (result[i].COLUMN_NAME == "last_name" && result[i].CHARACTER_MAXIMUM_LENGTH <= 45) {
                                structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            } else if (result[i].COLUMN_NAME == "last_name" && result[i].CHARACTER_MAXIMUM_LENGTH > 45) {
                                structure.character_maximum_length_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }

                            if (result[i].COLUMN_NAME == "address" && result[i].CHARACTER_MAXIMUM_LENGTH <= 512) {
                                structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            } else if (result[i].COLUMN_NAME == "address" && result[i].CHARACTER_MAXIMUM_LENGTH > 512) {
                                structure.character_maximum_length_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }

                            if (result[i].COLUMN_NAME == "position_id") {
                                structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }

                            if (result[i].COLUMN_NAME == "department_id") {
                                structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }

                            if (result[i].COLUMN_NAME == "id") {
                                structure.employees[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }
                        }
                        if (result[i].TABLE_NAME == "gmhrs_department_view") {
                            if (result[i].COLUMN_NAME == "id") {
                                structure.departments[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }

                            if (result[i].COLUMN_NAME == "name" && result[i].CHARACTER_MAXIMUM_LENGTH <= 200) {
                                structure.departments[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            } else if (result[i].COLUMN_NAME == "name" && result[i].CHARACTER_MAXIMUM_LENGTH > 200) {
                                structure.character_maximum_length_department[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }

                            if (result[i].COLUMN_NAME == "email" && result[i].CHARACTER_MAXIMUM_LENGTH <= 254) {
                                structure.departments[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            } else if (result[i].COLUMN_NAME == "email" && result[i].CHARACTER_MAXIMUM_LENGTH > 254) {
                                structure.character_maximum_length_department[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }
                        }
                        if (result[i].TABLE_NAME == "gmhrs_team_view") {
                            if (result[i].COLUMN_NAME == "id") {
                                structure.teams[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }

                            if (result[i].COLUMN_NAME == "name" && result[i].CHARACTER_MAXIMUM_LENGTH <= 200) {
                                structure.teams[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            } else if (result[i].COLUMN_NAME == "name" && result[i].CHARACTER_MAXIMUM_LENGTH > 200) {
                                structure.character_maximum_length_team[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }

                            if (result[i].COLUMN_NAME == "email" && result[i].CHARACTER_MAXIMUM_LENGTH <= 254) {
                                structure.teams[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            } else if (result[i].COLUMN_NAME == "email" && result[i].CHARACTER_MAXIMUM_LENGTH > 254) {
                                structure.character_maximum_length_team[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }
                        }
                        if (result[i].TABLE_NAME == "gmhrs_team_employee_view") {
                            structure.team_employee[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                        }
                        if (result[i].TABLE_NAME == "gmhrs_position_view") {
                            if (result[i].COLUMN_NAME == "id") {
                                structure.positions[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }

                            if (result[i].COLUMN_NAME == "name" && result[i].CHARACTER_MAXIMUM_LENGTH <= 200) {
                                structure.positions[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            } else if (result[i].COLUMN_NAME == "name" && result[i].CHARACTER_MAXIMUM_LENGTH > 200) {
                                structure.character_maximum_length_position[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                            }
                        }
                        if (result[i].TABLE_NAME == "gmhrs_vacation_date_view") {
                            structure.vacation_date[result[i].COLUMN_NAME] = (result[i].COLUMN_NAME)
                        }
                    }


                    // list mapping
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
                        for (var i = 0; i < recordset.length; i++) {
                            if (recordset[i].table_name == "gmhrs_employee_view") {
                                if (recordset[i].column_name == "primary_email" && recordset[i].character_maximum_length <= 254) {
                                    structure.employees[result[i].COLUMN_NAME] = (recordset[i].column_name)
                                } else if (recordset[i].column_name == "primary_email" && recordset[i].character_maximum_length > 254) {
                                    structure.character_maximum_length_employee[recordset[i].column_name] = (recordset[i].column_name)
                                }

                                if (recordset[i].column_name == "personal_email" && recordset[i].character_maximum_length <= 254) {
                                    structure.employees[recordset[i].column_name] = (recordset[i].column_name)
                                } else if (recordset[i].column_name == "personal_email" && recordset[i].character_maximum_length > 254) {
                                    structure.character_maximum_length_employee[recordset[i].column_name] = (recordset[i].column_name)
                                }

                                if (recordset[i].column_name == "phone" && recordset[i].character_maximum_length <= 15) {
                                    structure.employees[result[i].COLUMN_NAME] = (recordset[i].column_name)
                                } else if (recordset[i].column_name == "phone" && recordset[i].character_maximum_length > 15) {
                                    structure.character_maximum_length_employee[recordset[i].column_name] = (recordset[i].column_name)
                                }

                                if (recordset[i].column_name == "first_name" && recordset[i].character_maximum_length <= 45) {
                                    structure.employees[recordset[i].column_name] = (recordset[i].column_name)
                                } else if (recordset[i].column_name == "first_name" && recordset[i].character_maximum_length > 45) {
                                    structure.character_maximum_length_employee[recordset[i].column_name] = (recordset[i].column_name)
                                }

                                if (recordset[i].column_name == "last_name" && recordset[i].character_maximum_length <= 45) {
                                    structure.employees[recordset[i].column_name] = (recordset[i].column_name)
                                } else if (recordset[i].column_name == "last_name" && recordset[i].character_maximum_length > 45) {
                                    structure.character_maximum_length_employee[recordset[i].column_name] = (recordset[i].column_name)
                                }

                                if (recordset[i].column_name == "address" && recordset[i].character_maximum_length <= 512) {
                                    structure.employees[recordset[i].column_name] = (recordset[i].column_name)
                                } else if (recordset[i].column_name == "address" && recordset[i].character_maximum_length > 512) {
                                    structure.character_maximum_length_employee[recordset[i].column_name] = (recordset[i].column_name)
                                }

                                if (recordset[i].column_name == "position_id") {
                                    structure.employees[recordset[i].column_name] = (recordset[i].column_name)
                                }

                                if (recordset[i].column_name == "department_id") {
                                    structure.employees[recordset[i].column_name] = (recordset[i].column_name)
                                }

                                if (recordset[i].column_name == "id") {
                                    structure.employees[recordset[i].column_name] = (recordset[i].column_name)
                                }
                            }
                            if (recordset[i].table_name == "gmhrs_department_view") {
                                if (recordset[i].column_name == "id") {
                                    structure.departments[recordset[i].column_name] = (recordset[i].column_name)
                                }

                                if (recordset[i].column_name == "name" && recordset[i].character_maximum_length <= 200) {
                                    structure.departments[recordset[i].column_name] = (recordset[i].column_name)
                                } else if (recordset[i].column_name == "name" && recordset[i].character_maximum_length > 200) {
                                    structure.character_maximum_length_department[recordset[i].column_name] = (recordset[i].column_name)
                                }

                                if (recordset[i].column_name == "email" && recordset[i].character_maximum_length <= 254) {
                                    structure.departments[recordset[i].column_name] = (recordset[i].column_name)
                                } else if (recordset[i].column_name == "email" && recordset[i].character_maximum_length > 254) {
                                    structure.character_maximum_length_department[recordset[i].column_name] = (recordset[i].column_name)
                                }
                            }
                            if (recordset[i].table_name == "gmhrs_team_view") {
                                if (recordset[i].column_name == "id") {
                                    structure.teams[recordset[i].column_name] = (recordset[i].column_name)
                                }

                                if (recordset[i].column_name == "name" && recordset[i].character_maximum_length <= 200) {
                                    structure.teams[recordset[i].column_name] = (recordset[i].column_name)
                                } else if (recordset[i].column_name == "name" && recordset[i].character_maximum_length > 200) {
                                    structure.character_maximum_length_team[recordset[i].column_name] = (recordset[i].column_name)
                                }

                                if (recordset[i].column_name == "email" && recordset[i].character_maximum_length <= 254) {
                                    structure.teams[recordset[i].column_name] = (recordset[i].column_name)
                                } else if (recordset[i].column_name == "email" && recordset[i].character_maximum_length > 254) {
                                    structure.character_maximum_length_team[recordset[i].column_name] = (recordset[i].column_name)
                                }
                            }
                            if (recordset[i].table_name == "gmhrs_team_employee_view") {
                                structure.team_employee[recordset[i].column_name] = (recordset[i].column_name)
                            }
                            if (recordset[i].table_name == "gmhrs_position_view") {
                                if (recordset[i].column_name == "id") {
                                    structure.positions[recordset[i].column_name] = (recordset[i].column_name)
                                }

                                if (recordset[i].column_name == "name" && recordset[i].character_maximum_length <= 200) {
                                    structure.positions[recordset[i].column_name] = (recordset[i].column_name)
                                } else if (recordset[i].column_name == "name" && recordset[i].character_maximum_length > 200) {
                                    structure.character_maximum_length_position[recordset[i].column_name] = (recordset[i].column_name)
                                }
                            }
                            if (recordset[i].table_name == "gmhrs_vacation_date_view") {
                                structure.vacation_date[recordset[i].column_name] = (recordset[i].column_name)
                            }
                        }
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
    const mappingReq = req.body.mapping;
    const accountId = req.body.accountId;
    const dbHR = req.body.dbInfor;
    const dbInfo = {
        dbName: 'gmhrs',
        host: '103.143.209.237',
        port: '3306',
        username: 'root',
        password: 'Zz@123456',
        dialect: 'mysql'
    }
    console.log(accountId);
    console.log(dbHR);
    try {
        var dbConnect = '"' + dbHR.dbName + " " + dbHR.host + " " + dbHR.port + " " + dbHR.username + " " + dbHR.password + " " + dbHR.dialect + '"';
        var mappingResult = [
            {
                tableGM: "gmhrs_employee_view",
                tableHR:
                {
                    nametableHR: mappingReq[0].tableHR.nametableHR,
                    fields: {
                        id: mappingReq[0].tableHR.fields[0],
                        primary_email: mappingReq[0].tableHR.fields[1],
                        personal_email: mappingReq[0].tableHR.fields[2],
                        first_name: mappingReq[0].tableHR.fields[3],
                        last_name: mappingReq[0].tableHR.fields[4],
                        phone: mappingReq[0].tableHR.fields[5],
                        address: mappingReq[0].tableHR.fields[6],
                        position_id: mappingReq[0].tableHR.fields[7],
                        department_id: mappingReq[0].tableHR.fields[8]
                    }
                }
            },
            {
                tableGM: "gmhrs_department_view",
                tableHR:
                {
                    nametableHR: mappingReq[1].tableHR.nametableHR,
                    fields:
                    {
                        id: mappingReq[1].tableHR.fields[0],
                        name: mappingReq[1].tableHR.fields[1],
                        email: mappingReq[1].tableHR.fields[2]
                    }

                }
            },
            {
                tableGM: "gmhrs_team_view",
                tableHR:
                {
                    nametableHR: mappingReq[2].tableHR.nametableHR,
                    fields:
                    {
                        id: mappingReq[2].tableHR.fields[0],
                        name: mappingReq[2].tableHR.fields[1],
                        email: mappingReq[2].tableHR.fields[2]
                    }

                }
            },
            {
                tableGM: "gmhrs_team_employee_view",
                tableHR:
                {
                    nametableHR: mappingReq[3].tableHR.nametableHR,
                    fields:
                    {
                        employee_id: mappingReq[3].tableHR.fields[0],
                        team_id: mappingReq[3].tableHR.fields[1]
                    },

                }
            },
            {
                tableGM: "gmhrs_position_view",
                tableHR:
                {
                    nametableHR: mappingReq[4].tableHR.nametableHR,
                    fields:
                    {
                        id: mappingReq[4].tableHR.fields[0],
                        name: mappingReq[4].tableHR.fields[1]
                    }
                }
            },
            {
                tableGM: "gmhrs_vacation_date_view",
                tableHR:
                {
                    nametableHR: mappingReq[5].tableHR.nametableHR,
                    fields:
                    {
                        employee_id: mappingReq[5].tableHR.fields[0],
                        start_date: mappingReq[5].tableHR.fields[1],
                        end_date: mappingReq[5].tableHR.fields[2]
                    }

                }
            }
        ]
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

            //employee query
            var empQuery = " SELECT employee." + mappingResult[0].tableHR.fields.id + " as id, employee." + mappingResult[0].tableHR.fields.primary_email + " as primary_email, employee." + mappingResult[0].tableHR.fields.personal_email + " as personal_email, employee." + mappingResult[0].tableHR.fields.first_name + " as first_name, employee." + mappingResult[0].tableHR.fields.last_name + " as last_name, " +
                "employee.modified_date, employee." + mappingResult[0].tableHR.fields.address + " as address, employee." + mappingResult[0].tableHR.fields.position_id + " as position_id, employee." + mappingResult[0].tableHR.fields.department_id + " as department_id, employee." + mappingResult[0].tableHR.fields.phone + " as phone, employee.status_id, " +
                " department." + mappingResult[1].tableHR.fields.id + " AS department_id, department." + mappingResult[1].tableHR.fields.name + " AS department_name, " +
                "department." + mappingResult[1].tableHR.fields.email + " AS department_email , position." + mappingResult[4].tableHR.fields.id + " AS position_id , position." + mappingResult[4].tableHR.fields.name + " AS position_name , teams." + mappingResult[3].tableHR.fields.employee_id + " " +
                "AS teams_employee_id, teams." + mappingResult[3].tableHR.fields.team_id + " AS teams_team_id " +
                "FROM " + mappingResult[0].tableHR.nametableHR + " AS employee " +
                "LEFT OUTER JOIN " + mappingResult[1].tableHR.nametableHR + " AS department ON employee." + mappingResult[0].tableHR.fields.department_id + " = department." + mappingResult[1].tableHR.fields.id + " " +
                "LEFT OUTER JOIN " + mappingResult[4].tableHR.nametableHR + " AS position ON employee." + mappingResult[0].tableHR.fields.position_id + " = position.id " +
                "LEFT OUTER JOIN " + mappingResult[3].tableHR.nametableHR + " AS teams ON employee." + mappingResult[0].tableHR.fields.id + " = teams.employee_id " +
                "WHERE employee.status_id = 1 ORDER BY employee.primary_email ASC "

            //vacation query
            const vacationQuery = "SELECT " + mappingResult[5].tableHR.fields.employee_id + " as employee_id, " + mappingResult[5].tableHR.fields.start_date + " as start_date, " + mappingResult[5].tableHR.fields.end_date +
                " as end_date FROM " + mappingResult[5].tableHR.nametableHR + " AS vacation_date WHERE (current_date() between date(vacation_date." + mappingResult[5].tableHR.fields.start_date +
                ") and date(vacation_date." + mappingResult[5].tableHR.fields.end_date + ")) OR date(vacation_date." + mappingResult[5].tableHR.fields.start_date + ") >= current_date() ORDER BY vacation_date." + mappingResult[5].tableHR.fields.start_date + " DESC ";


            //department query
            const departmentQuery = "SELECT " + mappingResult[1].tableHR.fields.id + " as id, " + mappingResult[1].tableHR.fields.name +
                " as name, " + mappingResult[1].tableHR.fields.email + " FROM " + mappingResult[1].tableHR.nametableHR +
                " AS department WHERE department.status_id = 1 ORDER BY department." + mappingResult[1].tableHR.fields.name + " ASC ";


            //position query
            const positionQuery = "SELECT " + mappingResult[4].tableHR.fields.id + " as id, " + mappingResult[4].tableHR.fields.name +
                " as name FROM " + mappingResult[4].tableHR.nametableHR + " AS position ORDER BY position." + mappingResult[4].tableHR.fields.name + " ASC ";


            //team query
            const teamQuery = "SELECT team." + mappingResult[2].tableHR.fields.id + " as id, team." + mappingResult[2].tableHR.fields.name + " as name, team." + mappingResult[2].tableHR.fields.email + " as email, team.created_date, team.status_id, team.modified_date, team.description, " +
                "members." + mappingResult[3].tableHR.fields.team_id + " AS members_team_id, members." + mappingResult[3].tableHR.fields.employee_id + " AS members_employee_id, members.modified_date AS members_modified_date, " +
                "`members->" + mappingResult[0].tableHR.nametableHR + "`." + mappingResult[0].tableHR.fields.id + " AS members_employee_id, `members->" + mappingResult[0].tableHR.nametableHR + "`." + mappingResult[0].tableHR.fields.primary_email + " AS members_employee_primary_email, `members->" + mappingResult[0].tableHR.nametableHR + "`." + mappingResult[0].tableHR.fields.id + " " +
                "AS members_employee_employee_id FROM " + mappingResult[2].tableHR.nametableHR + " AS team LEFT OUTER JOIN " + mappingResult[3].tableHR.nametableHR + " AS members ON team." + mappingResult[2].tableHR.fields.id + " = members.team_id " +
                "LEFT OUTER JOIN " + mappingResult[0].tableHR.nametableHR + " AS `members->" + mappingResult[0].tableHR.nametableHR + "` ON members." + mappingResult[3].tableHR.fields.employee_id + " = `members->" + mappingResult[0].tableHR.nametableHR + "`." + mappingResult[0].tableHR.fields.id + " WHERE team.status_id = 1 ORDER BY team." + mappingResult[2].tableHR.fields.email + " ASC "


            const connection_mapping_query = '"Query:' + empQuery + 'Query:' + vacationQuery + 'Query:' + departmentQuery + 'Query:' + positionQuery + 'Query:' + teamQuery + '"';
            const connection_mapping_configuration = '"' + mappingResult[0].tableHR.nametableHR + ":" + mappingResult[0].tableHR.fields.id + "," + mappingResult[0].tableHR.fields.primary_email + "," + mappingResult[0].tableHR.fields.personal_email + "," + mappingResult[0].tableHR.fields.first_name + "," + mappingResult[0].tableHR.fields.last_name + "," +
                mappingResult[0].tableHR.fields.phone + "," + mappingResult[0].tableHR.fields.address + "," + mappingResult[0].tableHR.fields.position_id + "," + mappingResult[0].tableHR.fields.department_id + " " +
                mappingResult[1].tableHR.nametableHR + ":" + mappingResult[1].tableHR.fields.id + "," + mappingResult[1].tableHR.fields.name + "," + mappingResult[1].tableHR.fields.email + " " +
                mappingResult[2].tableHR.nametableHR + ":" + mappingResult[2].tableHR.fields.id + "," + mappingResult[2].tableHR.fields.name + "," + mappingResult[2].tableHR.fields.email + " " +
                mappingResult[3].tableHR.nametableHR + ":" + mappingResult[3].tableHR.fields.employee_id + "," + mappingResult[3].tableHR.fields.team_id + " " +
                mappingResult[4].tableHR.nametableHR + ":" + mappingResult[4].tableHR.fields.id + "," + mappingResult[2].tableHR.fields.name + " " +
                mappingResult[5].tableHR.nametableHR + ":" + mappingResult[5].tableHR.fields.employee_id + "," + mappingResult[5].tableHR.fields.start_date + "," + mappingResult[5].tableHR.fields.end_date + '"'
            // var crypQuery = "'" + crypto.AES.encrypt(connection_mapping_query, "Zz@123456") + "'";

            const iv = crypto.randomBytes(16);
            const encryptedDB = await deCrypt.encrypt(dbConnect, iv, contants.private_key);
            const querySaveData = "update account set connection_database = " + encryptedDB + ", connection_mapping_query = " + connection_mapping_query + ", connection_mapping_configuration = " + connection_mapping_configuration + " where id = " + accountId;
            await connectionString.query(querySaveData, (err, result, fields) => {
                if (err) {
                    console.log(err);
                }
                var check = result;
                connectionString.destroy(function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
                if (check) {
                    var response = {
                        code: 200,
                        status: "Save mapping sucessfully!"
                    }
                    res.json(response);
                    return;
                } else {
                    var response = {
                        code: 500,
                        status: "Save mapping fail!"
                    }
                    res.json(response);
                    return;
                }

            })
        }
    } catch (error) {
        console.log(error);
        res.send("Server unavailable!")
    }
});

router.post("/data", async (req, res) => {
    const db = req.body.connection_string;
    const query = req.body.connection_mapping_query
    // const connection_database = null;
    // const connection_mapping_query = null;
    var employee = null;
    var vacation = null;
    var department = null;
    var position = null;
    var team = null;

    try {
        const dbInfo = {
            dbName: db.split(" ")[0],
            host: db.split(" ")[1],
            port: db.split(" ")[2],
            username: db.split(" ")[3],
            password: db.split(" ")[4],
            dialect: db.split(" ")[5]
        }
        console.log(dbInfo);
        employee = query.split("Query:")[1];
        vacation = query.split("Query:")[2];
        department = query.split("Query:")[3];
        position = query.split("Query:")[4];
        team = query.split("Query:")[5];
        var check = await testConnectionDao.checkConnection(dbInfo);
        console.log(check);
        var data = {
            employees: [],
            teams: [],
            departments: [],
            positions: []
        }
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
                if (err)
                    console.log('error when connecting to db gm:', err);

            });
            // const queryDBGMHRS = "select connection_database,connection_mapping_query from account where id = " + accountId;
            // console.log(queryDBGMHRS);
            // await connectionString.query(queryDBGMHRS, (err, result, fields) => {
            //     if (err) {
            //         console.log("select" + err);
            //     }
            //     connection_database = result[0].connection_database;
            //     dbInfoHR.dbName = result[0].connection_database.split(" ")[0];
            //     dbInfoHR.host = result[0].connection_database.split(" ")[1];
            //     dbInfoHR.port = result[0].connection_database.split(" ")[2];
            //     dbInfoHR.username = result[0].connection_database.split(" ")[3];
            //     dbInfoHR.password = result[0].connection_database.split(" ")[4];
            //     // dbInfoHR.dialect = result[0].connection_database.split(" ")[5];
            //     console.log(dbInfoHR);
            //     connection_mapping_query = result[0].connection_mapping_query
            //     employee = connection_mapping_query.split("Query:")[1];
            //     vacation = connection_mapping_query.split("Query:")[2];
            //     department = connection_mapping_query.split("Query:")[3];
            //     position = connection_mapping_query.split("Query:")[4];
            //     team = connection_mapping_query.split("Query:")[5];

            //     // var query = crypto.AES.decrypt(connection_mapping_query, "Zz@123456");
            //     // console.log(query);
            //     connectionString.destroy(function (err) {
            //         if (err) {
            //             console.log(err);
            //         }
            //     })
            // })

            //employee data
            var employeeResponse;
            var employeeResult
            await connectionString.query(employee, (err, result, fields) => {
                if (err) {
                    console.log(err);
                }
                employeeResponse = result;
                employeeResult = [
                    {
                        id: result[0].id,
                        primary_email: result[0].primary_email,
                        personal_email: result[0].personal_email,
                        first_name: result[0].first_name,
                        last_name: result[0].last_name,
                        modified_date: result[0].modified_date,
                        address: result[0].address,
                        position_id: result[0].position_id,
                        department_id: result[0].department_id,
                        phone: result[0].phone,
                        status_id: result[0].status_id,
                        vacation_start_date: null,
                        vacation_end_date: null,
                        department: {
                            id: result[0].department_id,
                            name: result[0].department_name,
                            email: result[0].department_email
                        },
                        position: {
                            id: result[0].position_id,
                            name: result[0].position_name
                        },
                        // teams: [

                        // ]
                    }
                ]
                var index = 0
                //bo team
                while (index < employeeResponse.length) {
                    var teamLength = 0;
                    for (let i = 0; i < employeeResponse.length; i++) {
                        if (employeeResult[teamLength].id === employeeResponse[i].id) {
                            // var teamid = { team_id: employeeResponse[i].teams_team_id };
                            // employeeResult[teamLength].teams.push(teamid);
                            index = index + 1;
                        } else if (employeeResult[teamLength].id !== employeeResponse[i].id) {
                            var newEmp = {
                                id: employeeResponse[i].id,
                                primary_email: employeeResponse[i].primary_email,
                                personal_email: employeeResponse[i].personal_email,
                                first_name: employeeResponse[i].first_name,
                                last_name: employeeResponse[i].last_name,
                                modified_date: employeeResponse[i].modified_date,
                                address: employeeResponse[i].address,
                                position_id: employeeResponse[i].position_id,
                                department_id: employeeResponse[i].department_id,
                                phone: employeeResponse[i].phone,
                                status_id: employeeResponse[i].status_id,
                                vacation_start_date: null,
                                vacation_end_date: null,
                                department: {
                                    id: employeeResponse[i].department_id,
                                    name: employeeResponse[i].department_name,
                                    email: employeeResponse[i].department_email
                                },
                                position: {
                                    id: employeeResponse[i].position_id,
                                    name: employeeResponse[i].position_name
                                },
                                // teams: [
                                //     { team_id: employeeResponse[i].teams_team_id }
                                // ]
                            }
                            employeeResult.push(newEmp);
                            teamLength = teamLength + 1;
                            index = index + 1;
                        }
                    }
                }
            })

            //vacation data
            await connectionString.query(vacation, (err, result, fields) => {
                if (err) {
                    console.log(err);
                }
                if (result.length > 0) {
                    for (let i = 0; i < employeeResult.length; i++) {
                        for (let j = 0; j < result.length; j++) {
                            if (employeeResult[i]["id"] === result[j].employee_id) {
                                employeeResult[i]["vacation_start_date"] = result[j].start_date;
                                employeeResult[i]["vacation_end_date"] = result[j].end_date;
                            }
                        }
                    }
                }
                data.employees = employeeResult
            })

            //department daata
            await connectionString.query(department, (err, result, fields) => {
                if (err) {
                    console.log(err);
                }
                var department = [];
                for (let i = 0; i < result.length; i++) {
                    var dep = {
                        id: result[i].id,
                        name: result[i].name,
                        email: result[i].email
                    }
                    department.push(dep)
                }
                data.departments = department
            })

            //team data
            await connectionString.query(team, (err, result, fields) => {
                if (err) {
                    console.log(err);
                }
                var teamResult = [
                    {
                        id: result[0].id,
                        name: result[0].name,
                        email: result[0].email,
                        description: result[0].description,
                        members: []
                    }
                ];

                var index = 0
                //bo team
                while (index < result.length) {
                    var teamLength = 0;
                    for (let i = 0; i < result.length; i++) {
                        if (teamResult[teamLength].id === result[i].members_team_id) {
                            var addMember = {
                                employee_id: result[i].members_employee_id,
                                employee: {
                                    employee_id: result[i].members_employee_employee_id,
                                    primary_email: result[i].members_employee_primary_email
                                }
                            }
                            teamResult[teamLength].members.push(addMember)
                            index = index + 1;
                        } else if (teamResult[teamLength].id !== result[i].members_team_id) {
                            var addTeam =
                            {
                                id: result[i].id,
                                name: result[i].name,
                                email: result[i].email,
                                description: result[i].description,
                                members: [
                                    {
                                        employee_id: result[i].members_employee_id,
                                        employee: {
                                            employee_id: result[i].members_employee_employee_id,
                                            primary_email: result[i].members_employee_primary_email
                                        }
                                    }
                                ]
                            }
                                ;
                            teamResult.push(addTeam)
                            teamLength = teamLength + 1;
                            index = index + 1;
                        }
                    }
                }
                data.teams = teamResult

            })

            //position data
            await connectionString.query(position, (err, result, fields) => {
                if (err) {
                    console.log(err);
                }
                var position = [];
                for (let i = 0; i < result.length; i++) {
                    var pos = {
                        id: result[i].id,
                        name: result[i].name,
                    }
                    position.push(pos)
                }
                data.positions = position
                console.log(data);
                res.json(data)
                connectionString.destroy(function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
            })
        }



    } catch (err) {
        console.log(err.message);
        res.send("Server error");
    }
});
module.exports = router;