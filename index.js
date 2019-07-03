//requires
const express = require('express');
const app = express();
const port = 3000;
const bodyparser = require('body-parser');


const qureies = require('./queries');
//const Sequelize = require('sequelize');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json())


//main
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('modules/home')
});
//api get request
app.get('/api/:id', function (req, res) {
    var id = req.params.id;
    qureies.select(id).then(result => {
        console.log(result);
        res.send(result);
    });
});

//api get all
app.get('/api/', function (req, res) {
    var id = req.params.id;
    qureies.selectall().then(result => {
        console.log(result);
        res.send(result);
    });
});

//api post 
app.post('/api/post', function (req, res) {
    console.log(req.body.name)
    //res.json(req.body);
    qureies.insert(req.body).then(result => {
        console.log(result);
        res.send("executed");

    })
});

//api delete
app.delete('/api/delete/:id', function (req, res) {
    var id = req.params.id;
    console.log(id)
    qureies.delete(id).then(result => {
        //console.log(result);
        res.send("data deleted");
    });
});


app.put('/api/put/:id', function (req, res) {
    console.log(req.body.Redis_key)
    qureies.update(req.body,req.params.id).then(result => {
        console.log(req.body.Id, req.body.Redis_key);
        res.send("data updated");
    })
    
});

//listening
app.listen(port, () => console.log(`lsitening app ${port}`));