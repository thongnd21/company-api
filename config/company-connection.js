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
    // dbCheckcoonection: (dbInfo) => {
    //     // return checkConnection(dbInfo);
    //     const connection = new Sequelize(dbInfo.dbName, dbInfo.username, dbInfo.password, {
    //         host: dbInfo.host,
    //         dialect: 'mysql',
    //         port: dbInfo.port,
    //         timestamps: false,
    //         pool: {
    //             max: 5,
    //             min: 0,
    //             acquire: 30000,
    //             idle: 10000
    //         }
    //     })
    //     return connection;
    // }
};
// function checkConnection(dbInfo) {
//     var newConnection = dbInfo;
//     console.log(dbInfo);
//     const connectionString = sql_connection.createConnection({
//         host: dbInfo.host,
//         user: dbInfo.username,
//         password: dbInfo.password,
//         database: dbInfo.dbName,
//         port: dbInfo.port,
//         // multipleStatements: true,
//         timestamps: false,
//         pool: {
//             max: 5,
//             min: 0,
//             acquire: 30000,
//             idle: 10000
//         }

//     })

//     connectionString.connect(function (err) {
//         if (err) throw err;
//         console.log('error when connecting to db:', err);
//         // setTimeout(checkConnection(dbInfo), 2000);
//     });
//     connectionString.on('error', function (err) {

//         console.log('db error', err);
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             console.log(dbInfo);
//             checkConnection(newConnection);
//         } else {
//             throw err;
//         }
//     });
//     var checking = [];
//     connectionString.query('select * from department', (err, result, fields) => {
//         if (err) {
//             console.log(err);
//         }
//         for (var i = 0; i < result.length; i++) {
//             checking.push(result[i])
//             console.log(result[i]);
//         }
//         return console.log(checking);
//     })
// }