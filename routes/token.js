const router = require('koa-router')()

const jwt = require('jsonwebtoken')
const config = require('../config/index')

router.post('/token/verify', async (ctx, next) => {
  const token = String(ctx.req.body.token);
  let jwt_secret = config.jwt.secretKey;

  // token does not exist
  if (!token) {
    ctx.body = { success:false, msg: 'not logged in' }
    ctx.throw(403)
  }

  // create a promise that decodes the token
  const checkToken = new Promise((resolve, reject) => {
      jwt.verify(token, jwt_secret, function (err, decoded) {
      if (err) reject(err)
      resolve(decoded);
      })
  });

  // if token is valid, it will respond with its info
  const respond = (token) => {
    ctx.body = { success: true, info: token }
  }

  // if it has failed to verify, it will return an error message
  const onError = (error) => {
    ctx.body = { success: false, message: error.message }
    ctx.throw(403)
  }

  // process the promise
  checkToken.then(respond).catch(onError)
})

module.exports = router