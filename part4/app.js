const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const middleware = require('./utils/middleware.js')
var morgan = require('morgan')
const logger = require('./utils/logger')
const mongoose = require('mongoose')


logger.info(`connecting to ${config.MONGODB_URI}`)
  
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((err) => logger.error('error connecting to MongoDB:', err.message))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('data', (req) => JSON.stringify(req.body))
const morganString = ':method :url :status :res[content-length] - :response-time ms :data'
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(morganString))
}


app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app