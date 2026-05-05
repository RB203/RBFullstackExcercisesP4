const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if(!blog.likes)
    blog.likes = 0
  if(!blog.title || !blog.url)
    return response.status(400).json({ error: 'title or url are missing' })
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

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  try{
      await Blog.findByIdAndDelete(id)
      response.status(204).end()
  }
  catch(error) 
  {
    response.status(400).send({ error: 'malformatted id' })
  }    
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const {title,author,url,likes} = request.body
  try{
      const blog = await Blog.findById(id)
      if(!blog) return response.status(404).end()
      if(title) blog.title = title
      if(author) blog.author = author
      if(url) blog.url = url
      if(likes) blog.likes = likes
      updatedBlog = await blog.save()
      response.json(updatedBlog).status(200).end()
  }
  catch(error) 
  {
    response.status(400).send({ error: 'malformatted id' })
  }    
})

module.exports = blogRouter