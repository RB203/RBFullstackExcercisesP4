const {test,beforeEach,after} = require('node:test')
const assert = require('node:assert')
const {initialUsers,usersInDb} = require('../utils/user_helper')
const supertest = require('supertest')
const app = require('../app')
const config = require('../utils/config')
const logger = require('../utils/logger')
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const saltRounds = 10

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  for (let user of initialUsers) {
    let userObject = new User(user)
    await userObject.save()
  }
})

test('users are returned as json', async () => {
    console.log('through API')
    const response = await api.get('/api/users').expect('Content-Type', /application\/json/)
    console.log("Hola")
    assert.strictEqual(200, response.status)
    assert.strictEqual(response.body.length, initialUsers.length)
    assert.deepStrictEqual(
      response.body.map(({ id, ...userWithoutId }) => userWithoutId),
      initialUsers
    )
    console.log(response.body);
    for(const result of response.body) {
      if(!result.id)
        assert.fail(`User entry ${JSON.stringify(result)} is missing the 'id' property`)
    }
})

test('a valid user can be added', async () => {
  const newUser = {
    title: "New User",
    author: "John Doe",
    url: "https://example.com/new-user",
    likes: 97
  }

  await api.post('/api/users').send(newUser).expect(200).expect('Content-Type', /application\/json/)

  const usersAfterAdding = await usersInDb()
  assert.strictEqual(usersAfterAdding.length, initialUsers.length + 1)
})

test('a user without likes can be added', async () => {
  const newUser = {
    title: "Super specific user",
    author: "John Doe",
    url: "https://example.com/new-user"
  }

  await api.post('/api/users').send(newUser).expect(201)

  const usersAfterAdding = await usersInDb()
  console.log(usersAfterAdding)
  const addedUser = usersAfterAdding.find(user => user.title === newUser.title);
  console.log(addedUser)
  assert.strictEqual(addedUser.likes, 0)
})

test('a user without title or url cannot be added', async () => {
  const newUser = {
    title: "Super specific user",
    author: "John Doe",
  }

  await api.post('/api/users').send(newUser).expect(400)
})

test('a user can be deleted', async () => {
  const users = await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/)
  const usersAfterAdding = users.body[0]
  await api.delete(`/api/users/${usersAfterAdding.id}`).expect(204)
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