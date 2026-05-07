const User = require('../models/user')


const initialUsers = [
  {
    username: "Solidus",
    name: "George Sears",
    password: "MGS2SoL",
    blogs: [],
  },
  {
    username: "Joker",
    name: "Ren Amamiya",
    password: "SMTP5R",
    blogs: [],
  }  
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialUsers, usersInDb
}