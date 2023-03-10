// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults({noCors: true})
const {PORT = 3000} = process.env
if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config()
}


const HTTP_METHOD_GET = 'get'
const HTTP_METHOD_OPTIONS = 'options'

server.use(middlewares)

server.use((request, response, next) => {

    // To get around CORS I had to just enable any origin, method and header for requests
    // Not a secure way of handling it but it works for this assignment
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', '*')

    // I also had to make it so the OPTIONS method does not require the API_KEY as browsers always
    // send an OPTIONS request before any modification methods to check the server and by default this
    // server required the OPTIONS request to have a valid API_KEY as well which is uneccessary and causes 
    // unauthorized error
    if (request.method.toLowerCase() !== HTTP_METHOD_GET && request.method.toLowerCase() !== HTTP_METHOD_OPTIONS) {

        const token = request.headers['x-api-key'] || ''

        if (!token) {
            return response.status('401').json({error: 'You are not allowed to access this resource'})
        }

        const key = process.env.API_KEY

        if (token === key) {
            return next()
        } else {
            return response.status('401').json({error: 'Invalid API Key provided - are not allowed to access this resource'})
        }
    }

    next()
})

server.use(router)

server.listen(PORT, () => {
    console.log('JSON Server is running in port: ' + PORT)
})
