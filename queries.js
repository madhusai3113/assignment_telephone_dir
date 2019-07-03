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
    }, opts);


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
    return new Promise(function (resolve, reject) {
        model.user.hasMany(model.phone, { foreignKey: 'uid' });
        model.phone.belongsTo(model.user, { foreignKey: 'id' });
        resolve();
    })
}

var insert_non_existing = function (body) {
    return model.user.create({
        id: null,
        name: body.name
    }).then(() => {
        model.user.findOne({
            where:
            {
                name: body.name
            }
        })
            .then(function (result) {
                model.phone.create({
                    uid: result.get('id'),
                    phoneNum: body.phoneNum,
                    address: body.address
                })
                    .then(function (results, metadata) {
                        return results;
                    })

            })
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
            include:
                [
                    {
                        model: model.phone,

                    }
                ]
        })
            .then(function (results) {
                return results;
            });
    },


    // insert_non_existing: function (body) {
    //     return model.user.create({
    //         id: null,
    //         name: body.name
    //     })
    //         .then(() => {
    //             model.phone.create({
    //                 uid: body.id,
    //                 phoneNum: body.phoneNum,
    //                 address: body.address
    //             })
    //                 .then(function (results, metadata) {
    //                     return results;
    //                 })

    //         })
    // },


    insert: function (body) {
        return model.user.findOne({
            where:
            {
                name: body.name
            }
        }).then(function (results, reject) {
            if (results) {
                console.log(results.get('name'));
                console.log(results.get('id'));
                model.phone.create({
                    uid: results.get('id'),
                    phoneNum: body.phoneNum,
                    address: body.address
                })
                    .then(function (results, metadata) {
                        return results;
                    })
            }
            else {
                insert_non_existing(body)
            }
        })

    },



    delete: function (id) {
        return model.phone.destroy({
            where: {
                uid: id
            }
        }).then(() => {
            model.user.destroy({
                where: {
                    id: id
                }
            }).then(function (results, metadata) {
                return results;
            })
        })

    },

    update: function (body, id) {
        return model.phone.update({
            address: body.address,
            phoneNum: body.phoneNum
        },
            {
                where: { id: id }
            })
            .then(function (results, metadata) {
                return results;
            })
            .catch(err =>
                handleError(err)
            )
    }
}