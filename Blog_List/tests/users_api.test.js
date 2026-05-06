const {test,beforeEach,after} = require('node:test')
const assert = require('node:assert')
const {initialUsers,usersInDb} = require('../utils/user_helper')
const {initialBlogs,blogsInDb} = require('../utils/blog_helper')
const supertest = require('supertest')
const app = require('../app')
const config = require('../utils/config')
const logger = require('../utils/logger')
const mongoose = require('mongoose')
const User = require('../models/user')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const saltRounds = 10

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  for (let user of initialUsers) {
    let userObject = new User(user)
    userObject.password = await bcrypt.hash(userObject.password, saltRounds)
    await userObject.save()
  }
})

test('users are returned as json', async () => {
    console.log('through API')
    const response = await api.get('/api/users').expect('Content-Type', /application\/json/)
    assert.strictEqual(200, response.status)
    assert.strictEqual(response.body.length, initialUsers.length)
    console.log(response.body);
    assert.deepStrictEqual(
      response.body.map(({ id, ...userWithoutId }) => userWithoutId),
      initialUsers.map(({ password, ...userWithoutPassword }) => userWithoutPassword)
    )
    for(const result of response.body) {
      if(!result.id)
        assert.fail(`User entry ${JSON.stringify(result)} is missing the 'id' property`)
    }
})

test('invalid user 1', async () => {
  const newUser = {
    name: "David",
    password: "MGS1",
  }
  
  const response =await api.post('/api/users').send(newUser).expect(400)
  console.log(response.body)
})

test('invalid user again', async () => {
  const newUser = {
    username: "Snake",
    name: "David",
  }

  const response =await api.post('/api/users').send(newUser).expect(400)
  console.log(response.body)
})

test('invalid user 2', async () => {
  const newUser = {
    username: "Sn",
    name: "David",
    password: "MGS1"
  }

  const response =await api.post('/api/users').send(newUser).expect(400)
  console.log(response.body)
})

test('existing user', async () => {
  const newUser = {
    username: "Solidus",
    name: "David",
    password: "MGS1"
  }

  const response =await api.post('/api/users').send(newUser).expect(400)
  console.log(response.body)
})

test('normal user added', async () => {
  const newUser = {
    username: "Liquid",
    name: "Eli",
    password: "MGS1"
  }

  const response =await api.post('/api/users').send(newUser).expect(201)
  console.log(response.body)
})


test('adding blog with existing user', async () => {
  const newUser = {
    username: "Liquid",
    name: "Eli",
    password: "MGS1"
  }

  const response = await api.post('/api/users').send(newUser).expect(201)

  const newBlog1 = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    userId: response.body.id,
  }
  const post1 = await api.post('/api/blogs').send(newBlog1).expect(201)
  
  const newBlog2 = {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    userId: response.body.id,
  }
  
  const post2 = await api.post('/api/blogs').send(newBlog2).expect(201)

  const responseUsers = await api.get('/api/users').expect('Content-Type', /application\/json/).expect(200)
  console.log(JSON.stringify(responseUsers.body))

  const responseBlogs = await api.get('/api/blogs').expect('Content-Type', /application\/json/).expect(200)
  console.log(responseBlogs.body)
})

test('a user can be updated', async () => {
  const users = await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/)
  const usersAfterAdding = users.body[0]
  console.log(usersAfterAdding)
  const updatedUser = await api.put(`/api/users/${usersAfterAdding.id}`).send({ ...usersAfterAdding, likes: usersAfterAdding.likes + 1 }).expect(200)
  console.log(updatedUser.body)
  assert.strictEqual(usersAfterAdding.likes + 1, updatedUser.body.likes)
})

after(async () => {
  logger.info('Finished testing, closing connection to database')
  await mongoose.connection.close()
})