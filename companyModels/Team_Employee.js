const Sequelize = require("sequelize");
const db = require("../config/company-connection");
const Employee = require("../companyModels/Employees");
const Team = require("../companyModels/Team");



module.exports = {
    EmpTeamModel: (db , emp, team) =>{
        // const emp = Employee.EmpModel(db);
        // const team = Team.TeamModel(db);
        const Team_Employee = db.define(
            "team_employee",
            {
                employee_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true
                },
                team_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true
                },
                modified_date: {
                    type: Sequelize.TIME
                }
            },
            {
                timestamps: false,
                freezeTableName: true
            }
        );
        
        Team_Employee.belongsTo(team, {
            as: 'members',
            foreignKey: "team_id",
            sourceKey: "id"
        });
        team.hasMany(Team_Employee, {
            as: 'members',
            foreignKey: "team_id",
            sourceKey: "id"
        });
        
        Team_Employee.belongsTo(emp, {
            foreignKey: "employee_id",
            sourceKey: "id"
        });
        emp.hasMany(Team_Employee, {
            foreignKey: "employee_id",
            sourceKey: "id"
        });
        return Team_Employee;
    }
};