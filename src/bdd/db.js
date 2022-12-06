const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('spotifydb',null,null,{
    dialect:"sqlite",
    host:'./db.sqlite'
})

module.exports = sequelize