const Employee = require("../companyModels/Employees");
const contants = require("../contants/contants");
const Department = require('../companyModels/Department');
const db = require("../config/company-connection");
const Team = require('../companyModels/Team');

module.exports = {
    getAllEmployee : async (dbInfo) => {
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
}