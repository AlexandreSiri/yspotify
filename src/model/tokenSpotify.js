const sequelize = require('../bdd/db')
const {Sequelize, DataTypes} = require('sequelize')
const attributes = {
        userId: {field: 'user_id', type: Sequelize.DataTypes.INTEGER, allowNull:false}, 
        accessToken: {field: 'access_token',type: DataTypes.STRING, allowNull: false},
        refreshToken: {field:'refresh_token',type: DataTypes.STRING, allowNull:false}
    }

const token = sequelize.define("token",attributes)

module.exports = {
    token,
    sequelize,
}

