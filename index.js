const model = require('./models');
const express = require('express');
const app = express();
const port = 3001;

const connection=require('./seqConn');
var user=require('./router.js')

app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
app.use(bodyParser.json());



var foriegn_key = function () {
    return new Promise(function (resolve, reject) {
        model.user.hasMany(model.phone, { foreignKey: 'uid' });
        model.phone.belongsTo(model.user, { foreignKey: 'id' });
        resolve();
    })
}

connection.authenticate()
.then(()=>{
    return foriegn_key();
})
.then(()=>{
    console.log("Sequalize connection established successfully");
    app.listen(port, () => console.log(`This app listening on port ${port}!`));
    app.use('/api', user);
})
.catch(function (error) {
    throw error;
});