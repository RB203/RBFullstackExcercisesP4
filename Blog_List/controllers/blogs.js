const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  try{
    const blog = await Blog.findById(id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  }
  catch(error) 
  {
    response.status(400).send({ error: 'malformatted id' })
  }
    
})

module.exports = blogRouter