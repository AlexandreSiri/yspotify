const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes/users.js','./src/routes/groups.js']

swaggerAutogen(outputFile, endpointsFiles)