const db = require('./config');
const Sequelize = require('sequelize');
const model = require('./models');
//mysql connection
var opts = {
    define: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true
    }
}


var sequelize = new Sequelize(db.mysql.database, db.mysql.username, db.mysql.password,
    {
        host: db.mysql.hostname,
        dialect: 'mysql'
    },opts);


sequelize
    .authenticate()
    .then(function () {
        return foriegn_key();
    })
    .then(function (err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });



var foriegn_key = function () {
    return new Promise(function (resolve,reject) {
        model.user.hasMany(model.phone, { foreignKey: 'uid' });
        model.phone.belongsTo(model.user, { foreignKey: 'id' });
        resolve();
    })
}



///functions
var file = module.exports = {
    select: function (id) {
        return model.user.findAll({
            where:
            {
                id: id
            },
            include: [{
                model: model.phone
                }]
        })
            .then(function (results) {
                return results;
            });
    },

    selectall: function () {
        return model.user.findAll({
            include: [{
                model: model.phone
                }]
        })
            .then(function (results) {
                return results;
            });
    },

    insert: function (value,address,phoneNum) {
        value = "'" + value + "'";
        //let q_string = "INSERT INTO my_database.my_table (Redis_key) VALUES (" + value + ");";
        return model.user.create({
            name: value
        }).then(function(){
            return model.phone.create({
                phoneNum: phoneNum,
                uid: id,
                address:address
            }).then(function (results, metadata) {
                return results;
            });
        })
            
    },
    delete: function (id) {
        //let q_string = "delete FROM my_database.my_table where id=+" + id + ";";
        return model.user.destroy({
            where: {
                id: id
            }
        })
            .then(function (results, metadata) {
                return results;
            });
    },
    update: function (id, value) {
        value = "'" + value + "'";
        //let q_string = "UPDATE my_database.my_table SET Redis_key=" + value + "WHERE Id=" + id + ";";
        return Project.update(
            { name: value },
            { where: { id: id } }
          )
            .then(function (results, metadata) {
                return results;
            });
    }
}