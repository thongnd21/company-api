const Sequelize = require("sequelize");
const Employees = require("./Employees");

module.exports = {
    VacationEmployeModel: (db) => {

        const emp = Employees.EmpModel(db);
        const Vacation_Employee = db.define(
            "vacation_date",
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true
                },
                start_date: {
                    type: Sequelize.DATE
                },
                end_date: {
                    type: Sequelize.DATE
                },
                created_date: {
                    type: Sequelize.DATE
                },
                employee_id: {
                    type: Sequelize.INTEGER,
                },
            },
            {
                timestamps: false,
                freezeTableName: true
            }
        );
        
        Vacation_Employee.belongsTo(emp, {
            foreignKey: "employee_id",
            sourceKey: "id"
        });
        emp.hasMany(Vacation_Employee, {
            foreignKey: "employee_id",
            sourceKey: "id"
        });
        return Vacation_Employee;
    }
};