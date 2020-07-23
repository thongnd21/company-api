const db = require("../config/company-connection");
const { check } = require("express-validator");
const department = require("../companyModels/Department");
module.exports = {
    checkConnection: async (dbInfo) => {
        try {
            var checkConnect = false;
            var dep = await department.DepModel(db.dbConnection(dbInfo));
            await db.dbConnection(dbInfo).authenticate()
            .then(() =>
                {
                    checkConnect = true;
                    // return checkConnect;
                } 
            )
            return await dep.findAll({
                where: { status_id: 1 }
                
            }).then(async res => {
                console.log(res[0]);
                return true;
            })
            
        } catch (err) {
            console.log(err);
        }
    },
};