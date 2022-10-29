const mongoose = require('mongoose')
const logger = require('../utils/logger')
  
const mongoUrl = process.env.MONGODB_URI
logger.info(`connecting to ${mongoUrl}`)
  
mongoose.connect(mongoUrl)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((err) => logger.error('error connecting to MongoDB:', err.message))

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})
  
module.exports = mongoose.model('Blog', blogSchema)