const Sequelize = require("sequelize");
const db = require("../config/company-connection");




module.exports = {
    PositionModel: (db) => {
        // const emp = Employee.EmpModel(db);
        // const team = Team.TeamModel(db);
        const Position = db.define(
            "position",
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true
                },
                name: {
                    type: Sequelize.INTEGER,
                    primaryKey: true

                }
            },
            {
                timestamps: false,
                freezeTableName: true
            }
        );         
        return Position;
    }
};