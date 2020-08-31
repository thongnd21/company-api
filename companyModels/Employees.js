const Sequelize = require("sequelize");
const Team = require('./Team');
const Department = require('./Department');
const Position = require('./Positon');


module.exports = {
    EmpModel: (db) => {
        const team = Team.TeamModel(db);
        const dep = Department.DepModel(db);
        const postion = Position.PositionModel(db);
        const Employee = db.define(
            "gmhrs_employee_view",
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true
                },
                first_name: {
                    type: Sequelize.STRING
                },
                last_name: {
                    type: Sequelize.STRING
                },
                personal_email: {
                    type: Sequelize.STRING
                },
                primary_email: {
                    type: Sequelize.STRING

                },
                address: {
                    type: Sequelize.STRING
                },
                phone: {
                    type: Sequelize.STRING
                },
                department_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true
                },
                status_id: {
                    type: Sequelize.INTEGER
                },
                position_id: {
                    type: Sequelize.INTEGER
                },
                created_date: {
                    type: Sequelize.DATE
                },
                modified_date: {
                    type: Sequelize.DATE
                }
            },
            {
                timestamps: false,
                freezeTableName: true
            }
        );
        Employee.belongsTo(dep, {
            as: 'department',
            foreignKey: "department_id",
            sourceKey: "id"
        });
        dep.hasMany(Employee, {
            as: 'department',
            foreignKey: "department_id",
            sourceKey: "id"
        });
        team.belongsToMany(Employee, {
            through: "team_employee",
            as: "team",
            foreignKey: "team_id"
        });
        Employee.belongsToMany(team, {
            through: "team_employee",
            as: "team",
            foreignKey: "employee_id"
        });
        Employee.belongsTo(postion, {
            foreignKey: "position_id",
            sourceKey: "id"
        });
        postion.hasMany(Employee, {
            foreignKey: "position_id",
            sourceKey: "id"
        });
        return Employee;
    }
}