const sequelize = require('../bdd/db')
const {Sequelize, DataTypes} = require('sequelize')
const bcrypt = require('bcrypt')
const attributes = {
        userId: {field: 'user_id', autoIncrement: true, primaryKey: true, type: Sequelize.DataTypes.INTEGER}, 
        pseudo: {field: 'pseudo',type: DataTypes.STRING, allowNull: false},
        password: {field: 'password',type: DataTypes.STRING, allowNull: false},
        groupId: {field:'group_id',type: DataTypes.INTEGER, allowNull:true}
    }

const options = {
        instanceMethods: {
            generateHash(password){
                return bcrypt.hash(password, bcrypt.genSaltSync(10))
            },
            validPassword(password){
                return bcrypt.compareSync(password,this.password)
            }
        }
    }
const userSchema = sequelize.define("User",attributes,options)
console.log(userSchema)

module.exports = {
    userSchema,
    sequelize,
}

// userSchema.prototype.validPassword = async (password, hash) =>{
//     return await bcrypt.compareSync(password,hash)
// }

