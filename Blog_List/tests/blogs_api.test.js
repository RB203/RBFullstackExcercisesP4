const {test,beforeEach,after} = require('node:test')
const assert = require('node:assert')
const {initialBlogs,blogsInDb} = require('../utils/blog_helper')
const supertest = require('supertest')
const app = require('../app')
const config = require('../utils/config')
const logger = require('../utils/logger')
const mongoose = require('mongoose')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
    console.log('through API')
    const response = await api.get('/api/blogs')
    // console.log()
    assert.strictEqual(200, response.status)
    assert.strictEqual(response.body.length, initialBlogs.length)
    // assert.deepStrictEqual(response.body, initialBlogs)

    console.log('through DB directly as if API')
    // const blogs = await Blog.find({})
    const blogs = await blogsInDb();
    assert.strictEqual(blogs.length, initialBlogs.length)
    // console.log("||||||||||||||||||||||Blogs in DB")
    // console.log(blogs)
    // console.log("||||||||||||||||||||||Original blogs")
    // console.log(initialBlogs)
    // assert.deepStrictEqual(blogs, initialBlogs)
    console.log(blogs[0].id)
})


after(async () => {
  logger.info('Finished testing, closing connection to database')
  await mongoose.connection.close()
})