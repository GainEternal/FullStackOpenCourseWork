const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    validate: [
      {
        validator: (username) => {
          return User.findOne({username})
            .then(result => {
              if (result == null) {
                return true
              } else {
                return false
              }
            })
            .catch(err => console.log(err.message))
        },
        msg: 'Username already exists. Choose a unique username.'
      }
    ]
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.passwordHash
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const User = mongoose.model('User', userSchema)
module.exports = User