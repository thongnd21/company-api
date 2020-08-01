const Employee = require('../companyModels/Employees');
const contants = require("../contants/contants");
const Team = require('../companyModels/Team');
const Department = require("../companyModels/Department");
const db = require("../config/company-connection");
const Team_Employee = require('../companyModels/Team_Employee');
module.exports = {
    findAllTeam: async (dbInfo) => {
        try {
            var teams = Team.TeamModel(db.dbConnection(dbInfo));
            var emp = Employee.EmpModel(db.dbConnection(dbInfo));
            db.dbConnection(dbInfo).authenticate()
                .then(() =>
                    console.log("db connected")
                )
                .catch(err => console.log("error: " + err))
            return await teams.findAll({
                where: { status_id: 1 }
            }).then(async res => {
                console.log(res)
                return res;
            })
        } catch (err) {
            console.log(err);
        }
    },
    findAllTeamToCheck: async (dbInfo) => {
        try {
            var teams = Team.TeamModel(db.dbConnection(dbInfo));
            var emp = Employee.EmpModel(db.dbConnection(dbInfo));
            var team_emp = Team_Employee.EmpTeamModel(db.dbConnection(dbInfo), emp, teams);
            db.dbConnection(dbInfo).authenticate()
                .then(() =>
                    console.log("db connected")
                )
                .catch(err => console.log("error: " + err))
            return await teams.findAll({
                include: [
                    {
                        attributes: ['employee_id', 'modified_date'],
                        model: team_emp,
                        include: [
                            {
                                attributes: ['primary_email'],
                                model: emp,
                            }
                        ],
                        as: 'members'
                    }],
                order: [['email', "ASC"]]
            }).then(async res => {
                console.log(res)
                return res;
            })
        } catch (err) {
            console.log(err);
        }
    },

};
