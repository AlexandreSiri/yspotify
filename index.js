const express = require('express')
const sequelize = require('./src/bdd/db');
const usersRouter = require('./src/routes/users')
const groupsRouter = require('./src/routes/groups')
const app = express()
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

require('dotenv').config()

sequelize.sync()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


app.use('/users', usersRouter);
app.use('/groups',groupsRouter)
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))



app.listen(process.env.PORT,(req,res) =>{console.log(`Listen on port ${process.env.PORT}`)})