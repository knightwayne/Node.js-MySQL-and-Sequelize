const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findByPk(1)()
    .then(user=>{
        req.user=user;      //user is a complete sequelize object added here
        next();
    })
    .catch(err=>{
        console.log(err);
    })

})
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize.sync(/*{force: true}*/)       //{force: true} 1 time thing to sync up tables during dev stage, dont do at production stage
.then(result=>{     //find user and return to next then
    return User.findByPk(1);
})
.then(user=>{     //check if user found
    if(!user){    //force create user
        return User.create({name: 'nightwayne', email: '123@test.com'});    //returning promise
    }
    return Promise.resolve(user);                                           //return user object converted to promise using resolve
})
.then(user=>{
    console.log(user);
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})
