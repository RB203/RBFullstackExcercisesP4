const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const tokenExtractor = (request, response,next) => {
    if(request.get('authorization')){
        request.token = getTokenFrom(request)
    }
    next()
}

module.exports = {
    tokenExtractor
}