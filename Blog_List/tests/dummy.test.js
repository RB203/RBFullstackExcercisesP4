const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const app = require('../app')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})


describe('total likes', () => {
  const listOfBlogs = [
    {
      _id: '5a42asdasdsadsadsa',
      title: 'On Understanding Data Abstraction, Revisited',
      author: 'William R. Cook',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Cook09.pdf',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: 'adsadsad324322qeewcdrwr3',
      title: 'A Discipline of Programming',
      author: 'Edsger W. Dijkstra',
      url: 'https://www.amazon.com/-/es/Edsger-W-Dijkstra/dp/013215871X/ref=sr_1_1?dib=eyJ2IjoiMSJ9.J-yGf-7dYb44uEd_ns2o4qbJ6Nhf6A12ftfqISoDFYU2fF7Z9JCAjKxbojpfQ1uc3tsRcr08slNZXoBGSGXu_jNXlDL-13v_5GLIrGNsnhKFSv1sMqAVMM338bBsnVHnU08BokLQn5-usjA2FKLZevjNcRNNWjjOGbAOa4G85f4-2m-uKLQuRCP3J39mjfDdpE2_2uqe7uMjiQ4meciR5Z-CDjP521xsaMvgiwCQdvc.3h4Cy6TOg_XwqcRevC0Ymt31laNMO7pHMGYPaDKQQbw&dib_tag=se&keywords=Edsger+Dijkstra&qid=1723793111&s=books&sr=1-1',
      likes: 3,
      __v: 0
    }
  ]

  test('blog with most likes', () => {
    const result = listHelper.totalLikes(listOfBlogs)
    assert.strictEqual(result, 15)
  })


  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listOfBlogs)
    assert.strictEqual(result, 15)
  })


  test('when list has many blogs and picking the one with more likes', () => {
    const biggest = {
      _id: '5a42asdasdsadsadsa',
      title: 'On Understanding Data Abstraction, Revisited',
      author: 'William R. Cook',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Cook09.pdf',
      likes: 7,
      __v: 0
    }
    const result = listHelper.favoriteBlog(listOfBlogs)
    assert.deepStrictEqual(result, biggest)
  })

  test('to search the author with the largest amount of blogs', () => {
    const biggest = {author:'Edsger W. Dijkstra',blogs: 2}
    const result = listHelper.mostBlogs (listOfBlogs)
    assert.deepStrictEqual(result, biggest)
  })

  test('to search the author with the largest number of likes', () => {
    const biggest = {author:'Edsger W. Dijkstra',likes: 8}
    const result = listHelper.mostLikes (listOfBlogs)
    assert.deepStrictEqual(result, biggest)
  })

})