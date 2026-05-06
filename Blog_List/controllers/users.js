const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    if(!username || !password)
        return response.status(400).json({ error: 'username or password are missing' })
    if(username.length < 3 || password.length < 3)
        return response.status(400).json({ error: 'username and password are too short, the minimum length is 3 characters' })
    const user = new User(request.body)
    user.password = await bcrypt.hash(password, 10)
    const result = await user.save()
    response.status(201).json(result)
})

userRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  try{
    const user = await User.findById(id)
    if (user) {
      response.json(user)
    } else {
      response.status(404).end()
    }
  }
  catch(error) 
  {
    response.status(400).send({ error: 'malformatted id' })
  }
    
})

userRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  try{
      await User.findByIdAndDelete(id)
      response.status(204).end()
  }
  catch(error) 
  {
    response.status(400).send({ error: 'malformatted id' })
  }    
})

userRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const {title,author,url,likes} = request.body
  try{
      const user = await User.findById(id)
      if(!user) return response.status(404).end()
      if(title) user.title = title
      if(author) user.author = author
      if(url) user.url = url
      if(likes) user.likes = likes
      updatedUser = await user.save()
      response.json(updatedUser).status(200).end()
  }
  catch(error) 
  {
    response.status(400).send({ error: 'malformatted id' })
  }    
})

module.exports = userRouter