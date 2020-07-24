const Employee = require("../companyModels/Employees");
const contants = require("../contants/contants");
const Department = require('../companyModels/Department');
const db = require("../config/company-connection");
const Team = require('../companyModels/Team');

module.exports = {
    getAllEmployee: async (dbInfo) => {
        try {
            var dep = Department.DepModel(db.dbConnection(dbInfo));
            var emp = Employee.EmpModel(db.dbConnection(dbInfo));
            db.dbConnection(dbInfo).authenticate()
                .then(() =>
                    console.log("db connected")
                )
            return await emp.findAll(
                {
                    include: [{
                        model: dep,
                        attributes: ['name']
                    }],
                    where: { status_id: contants.EMPLOYEE_STATUS_ACTIVE }
                }
            )
        } catch (err) {
            console.log(err);
        }
    },
    getAllEmployeeToCheck: async (dbInfo) => {
        try {
            var dep = Department.DepModel(db.dbConnection(dbInfo));
            var emp = Employee.EmpModel(db.dbConnection(dbInfo));
            db.dbConnection(dbInfo).authenticate()
                .then(() =>
                    console.log("db connected")
                )
            return await emp.findAll({
                attributes: ['id', 'primary_email', 'personal_email',
                    'first_name', 'last_name', 'modified_date', 'address',
                    'department_id', 'phone', 'status_id'],
                include: [
                    {
                        model: dep,
                        attributes: ['id', 'name'],
                        where: {
                            status_id: 1
                        }
                    }
                ],
                order: [
                    ['primary_email', 'ASC']
                ]
            }).then(async res => {
                console.log(res)
                return res
            });
        } catch (err) {
            console.log(err);
        }
    },
}