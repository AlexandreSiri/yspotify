const sequelize = require('../bdd/db')
const {Sequelize, DataTypes} = require('sequelize')
const bcrypt = require('bcrypt')
const attributes = {
        groupId: {field: 'user_id', autoIncrement: true, primaryKey: true, type: Sequelize.DataTypes.INTEGER}, 
        name: {field: 'name',type: DataTypes.STRING, allowNull: false},
        chefId: {field: 'chef_id',type: DataTypes.INTEGER, allowNull: true},
        nbrUser: {type: DataTypes.INTEGER}
    }


const groupSchema = sequelize.define("Group",attributes)
console.log(groupSchema)

module.exports = {
    groupSchema,
    sequelize,
}

// userSchema.prototype.validPassword = async (password, hash) =>{
//     return await bcrypt.compareSync(password,hash)
// }

