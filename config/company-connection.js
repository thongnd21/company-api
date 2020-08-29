const Sequelize = require("sequelize");
module.exports = {
    dbConnection: (dbInfo) => {
        try {
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
        } catch (error) {
            console.log(error);
        }

    },
    dbConnectionGmHRS: () => {
        return new Sequelize('gmhrs', 'root', 'Z@123456', {
            // host: '103.143.209.237',
            host: 'localhost',
            dialect: 'mysql',
            port: 3306,
            logging: false,
            timestamps: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        })
    }
}
