const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    if(!username || !password) return response.status(400).json({ error: 'username or password are missing' })

    const user = await User.findOne({ username : username})
    const passwordCorrect = user === null
        ? false
    : await bcrypt.compare(password, user.password)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    return response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter