const Department = require("../companyModels/Department");
const db = require("../config/company-connection");
module.exports = {
    findAllDepartment: async (dbInfo) => {
        try {
            var dep = Department.DepModel(db.dbConnection(dbInfo));
            db.dbConnection(dbInfo).authenticate()
                .then(() =>
                    console.log("db connected")
                )
            return await dep.findAll({
                where: { status_id: 1 }

            }).then(async res => {
                return res;
            })
        } catch (err) {
            console.log(err);
        }
    },

    findAllDepartmentToCheck: async (dbInfo) => {
        try {
            var dep = Department.DepModel(db.dbConnection(dbInfo));
            db.dbConnection(dbInfo).authenticate()
                .then(() =>
                    console.log("db connected")
                )
            return await dep.findAll({
                order: [['name', "ASC"]]
            }).then(async res => {
                return res;
            })
        } catch (err) {
            console.log(err);
        }
    },
};
