const logger = require("./logger")
const Blog = require("../models/blog")
const lodash = require("lodash")

const dummy = (blogs) => {
    blogs.forEach(element => {
        logger.info(element)
        // console.log(element)
    });
    return 1
}

const totalLikes = (blogs) => {
    let total = 0
    blogs.forEach(element => {
        total += element.likes
        logger.info(total)
    });
    return total
}

const favoriteBlog = (blogs) => {
    const highest = {likes : 0,position : 0}
    for (let i = 0; i<blogs.length;i++){
        if(highest.likes < blogs[i].likes) {
            highest.likes = blogs[i].likes
            highest.position = i
        }
        logger.info(highest.position)
    }

    if (blogs.length > 0) return  {...blogs[highest.position]}
    else return {}
}

const mostBlogs  = (blogs) => {
    const total = lodash.countBy(blogs,'author')
    // logger.info(total)
    let max = 0
    const author = { author: '' , blogs : 0 }
    for (let name in total){
        let totalBlogs = total[name]
        if (max < totalBlogs) {
            author.author = name
            author.blogs = totalBlogs
            max = totalBlogs
        }
    }
    return author

}

const mostLikes = (blogs) => {
    const result = lodash.reduce(blogs,(resultAccumulator,blog)=>{
        if(!resultAccumulator.authors.hasOwnProperty(blog.author)) resultAccumulator.authors[blog.author] = 0
        resultAccumulator.authors[blog.author] += blog.likes
        // logger.info(resultAccumulator.authors[blog.author])
        if(resultAccumulator.authors[blog.author] > resultAccumulator.maxLikes){
            resultAccumulator.maxAuthor = blog.author
            resultAccumulator.maxLikes = resultAccumulator.authors[blog.author]
        }
        return resultAccumulator
    },
    {
        maxAuthor:'', maxLikes:0, authors: {}
    })
    // logger.info(result.maxAuthor)
    // logger.info(result.maxLikes)
    // logger.info(result.authors)
    return {
        author:result.maxAuthor,
        likes:result.maxLikes
    }
}

module.exports = {
    dummy,totalLikes,favoriteBlog,mostBlogs ,mostLikes
}