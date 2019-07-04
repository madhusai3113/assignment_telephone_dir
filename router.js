var express = require('express');
var router = express.Router();
var model = require('./models');


//get all
router.get('/', (req, res) => {
    model.user.findAll(
        {
            include: [{
                model: model.phone,
            }]
        })
        .then(data => {
            res.send(data);
        });
});

//get by id
router.get('/:id', (req, res) => {
    model.user.findOne(
        {
            where:
            {
                id: req.params.id
            },
            include: [{
                model: model.phone,
            }]
        })
        .then(data => {
            if (data !== null) {
                res.send(data);
            } else {
                res.send("User Not Found");
            }
        });
})

//post 
router.post('/post', (req, res) => {
    model.phone.findOne({
        //check if phone number exists
        where: {
            phoneNum: req.body.phoneNum
        }
    })
    .then(phone_token=> {
        //phone number doesnt exists then check if aadhar exists  
        if(phone_token == null){
            model.phone.findOne({
                where:{
                    aadhar : req.body.aadhar
                }
            })
            .then(aadhar_token=>{
                //if aadhar doesnt exist create user
                if(aadhar_token == null){
                    model.user.create({
                        id:null,
                        name:req.body.name
                    })
                    .then(user_token=>{
                        model.phone.create({
                            uid:user_token.id,
                            aadhar:req.body.aadhar,
                            address:req.body.address,
                            phoneNum:req.body.phoneNum
                        })
                        .then(result=>{
                            res.send("user created");
                        })
                        .catch(err=>{
                            res.send(err);
                        })
                        
                    })
                    .catch(err=>{
                        res.send("cannot new create user"+err)
                    })
                }
                //if aadhar exists add details 
                else{
                    model.phone.create({
                        uid:aadhar_token.uid,
                        aadhar:req.body.aadhar,
                        address:req.body.address,
                        phoneNum:req.body.phoneNum
                    })
                    .then(result=>{
                        
                        res.send("user already exist so contact details are added")
                    })
                    .catch(err=>{
                        console.log(aadhar_token.id)
                        console.log(err)
                        res.send("cannot add contact")
                    })
                }
            })
        }
        else{
            //if phone exists return already exists
            res.send("cannot add data phone number already exists");
        }
    })
})


router.delete('/:id',(req,res)=>{
    model.phone.findOne(
        {
            where:
            {
                id:req.params.id
            }
        })
    .then(result=>{
        if(result!==null){
            result.destroy();
            res.send("Contact deleted");
        }
        else {
            res.send("User Not Found");
        }         
    })
    .catch(err=>{
        console.log(err)
        res.send(err);
    })
})

router.put('/:id',(req,res)=>{
    model.phone.findOne({
        where:
        {
            id:req.params.id
        }
    })
    .then((result)=>{
        if(result!==null){
            result.update(
                {
                    phoneNum:req.body.phoneNum,
                    address:req.body.address
                })
            .then((data)=>{
            res.send(data);
            })
            .catch(function(err){
            res.send("Phone number already exist cannot update contact");
            })
    }else{
        res.send("Contact Not Found cannot delete");
     }
    })
})


module.exports = router;