const Sequelize = require("sequelize");
const db = require('./../config/company-connection');

module.exports = {
    DepModel: (db) =>{
        const Department = db.define(
            "gmhrs_department_view",
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
                    status_id: {
                        type: Sequelize.STRING
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
        return Department;
    }
};
