const User = require('../models/user')
const bcrypt = require('bcrypt')
const saltRounds = 10

const initialUsers = [
  {
    username: "Solidus",
    name: "George Sears",
    password: await bcrypt.hash("MGS2SoL", saltRounds)
  },
  {
    username: "Joker",
    name: "Ren Amamiya",
    password: await bcrypt.hash("SMTP5R", saltRounds)
  }  
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialUsers, usersInDb
}