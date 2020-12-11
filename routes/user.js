const router = require('koa-router')()

const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config/index')

router.post('/user/login', async (ctx, next) => {
  const u = ctx.request.body
  
  if (u) {
    console.log(u)
    await User.find({ id: u.id, pw: u.password })
      .then((user) => {
        console.log(user)
        const token = jwt.sign({
          id: user[0].id,
          name: user[0].name,
          position: user[0].position
        }, config.jwt.secretKey, {
          expiresIn: config.jwt.expiresIn,
          issuer: config.jwt.issuer,
          subject: config.jwt.subject
        })
        ctx.body = { user: { id: user[0].id, name: user[0].name, position: user[0].position }, token: token } // { 아이디, 이름, 포지션 }, token 보냄
        console.log(ctx.body)
      })
      .catch((e) => {
        console.log(e)
      })
  }
})

module.exports = router