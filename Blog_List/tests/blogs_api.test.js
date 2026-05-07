const {test,beforeEach,after} = require('node:test')
const assert = require('node:assert')
const {initialBlogs,blogsInDb} = require('../utils/blog_helper')
const {initialUsers,usersInDb} = require('../utils/user_helper')
const supertest = require('supertest')
const app = require('../app')
const config = require('../utils/config')
const logger = require('../utils/logger')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const saltRounds = 10

const api = supertest(app)
//THESE TESTS ARE NOT PART OF PART 4 OF SECTION D (ONLY SECTION B)
beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
  await User.deleteMany({})
  for (let user of initialUsers) {
    let userObject = new User(user)
    userObject.password = await bcrypt.hash(userObject.password, saltRounds)
    await userObject.save()
  }  
})

test('blogs are returned as json', async () => {
    console.log('through API')
    const response = await api.get('/api/blogs').expect('Content-Type', /application\/json/)
    // console.log()
    assert.strictEqual(200, response.status)
    assert.strictEqual(response.body.length, initialBlogs.length)
    assert.deepStrictEqual(
      response.body.map(({ id, ...blogWithoutId }) => blogWithoutId),
      initialBlogs
    )
    console.log(response.body);
    for(const result of response.body) {
      if(!result.id)
        assert.fail(`Blog entry ${JSON.stringify(result)} is missing the 'id' property`)
    }
})

test('a valid blog can be added', async () => {
  const trueLogin = await api.post('/api/login').send({ username: 'Solidus', password: 'MGS2SoL' }).expect('Content-Type', /application\/json/).expect(200)
  const newBlog = {
    title: "New Blog",
    author: "John Doe",
    url: "https://example.com/new-blog",
    likes: 97,
    userId: "testing",
  }

  await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${trueLogin.body.token}`).expect(201).expect('Content-Type', /application\/json/)

  const blogsAfterAdding = await blogsInDb()
  assert.strictEqual(blogsAfterAdding.length, initialBlogs.length + 1)
})

test('a blog without likes can be added', async () => {
  const trueLogin = await api.post('/api/login').send({ username: 'Solidus', password: 'MGS2SoL' }).expect('Content-Type', /application\/json/).expect(200)

  const newBlog = {
    title: "Super specific blog",
    author: "John Doe",
    url: "https://example.com/new-blog",
    userId: "testing",
  }

  await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${trueLogin.body.token}`).expect(201)

  const blogsAfterAdding = await blogsInDb()
  console.log(blogsAfterAdding)
  const addedBlog = blogsAfterAdding.find(blog => blog.title === newBlog.title);
  console.log(addedBlog)
  assert.strictEqual(addedBlog.likes, 0)
})

test('a blog without title or url cannot be added', async () => {
  const trueLogin = await api.post('/api/login').send({ username: 'Solidus', password: 'MGS2SoL' }).expect('Content-Type', /application\/json/).expect(200)

  const newBlog = {
    title: "Super specific blog",
    author: "John Doe",
    userId: "testing",
  }

  await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${trueLogin.body.token}`).expect(400)
})

//It is already done in the users_api.test.js
test('a blog can be deleted', async () => {
  // const blogs = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
  // const trueLogin = await api.post('/api/login').send({ username: 'Solidus', password: 'MGS2SoL' }).expect('Content-Type', /application\/json/).expect(200)
  // const blogsAfterAdding = blogs.body[0]
  // await api.delete(`/api/blogs/${blogsAfterAdding.id}`).set('Authorization', `Bearer ${trueLogin.body.token}`).expect(204)

  const trueLogin = await api.post('/api/login').send({ username: 'Solidus', password: 'MGS2SoL' }).expect('Content-Type', /application\/json/).expect(200)
  const newBlog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  }
  const post1 = await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${trueLogin.body.token}`).expect(201)
  const finalResult = await api.delete(`/api/blogs/${post1.body.id}`).set('Authorization', `Bearer ${trueLogin.body.token}`).expect(204)
  console.log(finalResult.body) 
})

test('a blog can be updated', async () => {
  const blogs = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
  const blogsAfterAdding = blogs.body[0]
  console.log(blogsAfterAdding)
  const updatedBlog = await api.put(`/api/blogs/${blogsAfterAdding.id}`).send({ ...blogsAfterAdding, likes: blogsAfterAdding.likes + 1 }).expect(200)
  console.log(updatedBlog.body)
  assert.strictEqual(blogsAfterAdding.likes + 1, updatedBlog.body.likes)
})

after(async () => {
  logger.info('Finished testing, closing connection to database')
  await mongoose.connection.close()
})