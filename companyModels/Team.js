const Sequelize = require("sequelize");
const Employee = require('./Employees');

module.exports = {
    TeamModel: (db) =>{
        const Team = db.define(
                "team",
                {
                    id: {
                        type: Sequelize.INTEGER,
                        primaryKey: true
                    },
                    name: {
                        type: Sequelize.STRING
                    },
                    email: {
                        type: Sequelize.STRING
                    },
                    description: {
                        type: Sequelize.STRING
                    },
                    created_date: {
                        type: Sequelize.DATE
                    },
                    modified_date: {
                        type: Sequelize.DATE
                    },
                    status_id: {
                        type: Sequelize.INTEGER
                    }
                },
                {
                    timestamps: false,
                    freezeTableName: true
                }
            
            );
        return Team;
    }
};
