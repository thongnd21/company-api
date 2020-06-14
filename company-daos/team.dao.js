const Employee = require('../companyModels/Employees');
const contants = require("../contants/contants");
const Team = require('../companyModels/Team');
const Department = require("../companyModels/Department");
const db = require("../config/company-connection");
module.exports = {
    findAllTeam: async (dbInfo) => {
        try {
            var teams =Team.TeamModel(db.dbConnection(dbInfo));
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

};
