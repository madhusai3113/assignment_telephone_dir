const db = require('./config');
const Sequelize = require('sequelize');

//mysql connection

var sequelize = new Sequelize(db.mysql.database, db.mysql.username, db.mysql.password,
    {
        host: db.mysql.hostname,
        dialect: 'mysql'
    });
    module.exports = sequelize;
