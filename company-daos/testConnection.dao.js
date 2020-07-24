const db = require("../config/company-connection");
const { check } = require("express-validator");
module.exports = {
    checkConnection: async (dbInfo) => {
        try {
            var checkConnect = false;
            return await db.dbConnection(dbInfo).authenticate()
                .then(() => {
                    checkConnect = true;
                    return checkConnect;
                }
                )
        } catch (err) {
            console.log(err);
        }
    },
};