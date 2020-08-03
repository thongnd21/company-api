const Position = require("../companyModels/Positon");
const db = require("../config/company-connection");
module.exports = {
    
    findAllPositionToCheck: async (dbInfo) => {
        try {
            var postion = Position.PositionModel(db.dbConnection(dbInfo));
            db.dbConnection(dbInfo).authenticate()
                .then(() =>
                    console.log("db connected")
                )
            return await postion.findAll({
                order: [['name', "ASC"]]
            }).then(async res => {
                return res;
            })
        } catch (err) {
            console.log(err);
        }
    },
};
