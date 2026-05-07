const User = require('../models/user')
const jwt = require('jsonwebtoken')

const userExtractor = async (request, response, next) => {
    if(request.token){
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }
        const user = await User.findById(decodedToken.id)
        if(!user) return response.status(400).json({ error: 'UserId missing or not valid' })
        request.user = user
    }else return response.status(401).json({ error: 'token missing' })
    next()
}

module.exports = {
    userExtractor
}