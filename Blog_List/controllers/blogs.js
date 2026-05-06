const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {userExtractor} = require('../utils/userExtractor')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogRouter.post('/', userExtractor, async (request, response) => {
  if (!request.body.likes)
    request.body.likes = 0
  if (!request.body.title || !request.body.url)
    return response.status(400).json({ error: 'title or url are missing' })
  const blog = new Blog({ title: request.body.title, author: request.body.author, url: request.body.url, likes: request.body.likes })
  let result;

  const user = request.user
  blog.user = user.id
  result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  
  return response.status(201).json(result)
})

blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  try {
    const blog = await Blog.findById(id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  }
  catch (error) {
    response.status(400).send({ error: 'malformatted id' })
  }

})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id
  const user = request.user
  const blog = await Blog.findById(id)
  if(user.id.toString() === blog.user.toString()){    
    await Blog.findByIdAndDelete(id)
    user.blogs.pop(id)
    await user.save()
    return response.status(204).end()
  }
  else return response.status(401).json({ error: `only the creator of the blog can delete it` })
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const { title, author, url, likes } = request.body
  try {
    const blog = await Blog.findById(id)
    if (!blog) return response.status(404).end()
    if (title) blog.title = title
    if (author) blog.author = author
    if (url) blog.url = url
    if (likes) blog.likes = likes
    updatedBlog = await blog.save()
    response.json(updatedBlog).status(200).end()
  }
  catch (error) {
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = blogRouter