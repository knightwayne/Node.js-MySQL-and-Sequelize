const Sequelize = require('sequelize');

const sequelize = new Sequelize('shoppingcart', 'root', 'bat', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;