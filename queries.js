

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
                    .catch(function(reject){
                        console.log(reject)
                        return reject
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

    insert: function (body) {

        return model.phone.findOne({
            where:{
                phoneNum:body.phoneNum
            }
        }).then(function(res,rej){
            if(!res){
                return model.user.findOne({
                    where:
                    {
                        name: body.name
                    }
                }).then(function (results) {
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
                
            }
            else{
                
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