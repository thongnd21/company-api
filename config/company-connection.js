const Sequelize = require("sequelize");
module.exports = {
    dbConnection: (dbInfo) => { 
    const connection = new Sequelize(dbInfo.dbName, dbInfo.username, dbInfo.password, {
        host: dbInfo.host,
        dialect: dbInfo.dialect,
        port: dbInfo.port,
        timestamps: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    })
    return connection;
    }
};
