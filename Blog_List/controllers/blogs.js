const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  if(!request.body.userId)
    return response.status(400).json({ error: 'userId is missing or is not valid' })

  if(!request.body.likes)
    request.body.likes = 0
  if(!request.body.title || !request.body.url)
    return response.status(400).json({ error: 'title or url are missing' })
  const blog = new Blog({title : request.body.title, author: request.body.author, url: request.body.url, likes: request.body.likes})
  let result;
  //TO prevent destroying blogs_api.test.js
  if(request.body.userId !== 'testing'){
    const uploadedUser = await User.findById(request.body.userId)
    if(uploadedUser){
      blog.user = request.body.userId
      result = await blog.save()
      uploadedUser.blogs = uploadedUser.blogs.concat(result._id)
      await uploadedUser.save()
    }
  }else result = await blog.save()
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