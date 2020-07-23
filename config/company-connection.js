const Sequelize = require("sequelize");
const sql_connection = require('mysql');
module.exports = {
    dbConnection: (dbInfo) => {
        const connection = new Sequelize(dbInfo.dbName, dbInfo.username, dbInfo.password, {
            host: dbInfo.host,
            dialect: 'mysql',
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
    },
}
