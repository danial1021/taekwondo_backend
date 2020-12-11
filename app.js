const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const cors = require('@koa/cors')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
const path = require('path')
const mongoose = require('mongoose')

const config = require('./config/index')
const User = require('./models/user')
const index = require('./routes/index');
const user = require('./routes/user');
const token = require('./routes/token');

const port = process.env.PORT || config.port

// error handler
onerror(app)

// middlewares
app.use(bodyparser())
  .use(cors())
  .use(json())
  .use(logger())
  .use(require('koa-static')(__dirname + '/public'))
  .use(views(path.join(__dirname, '/views'), {
    options: {settings: {views: path.join(__dirname, 'views')}},
    map: {'hjs': 'hogan'},
    extension: 'hjs'
  }))
  .use(router.routes())
  .use(router.allowedMethods())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - $ms`)
})

// db 연결 테스트
mongoose.connect(config.dbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
)
  .then(() => console.log('MongoDB 연결 성공!'))
  .catch(() => console.log('MongoDB 연결 실패!'))

User.findOne({ id: config.admin.id })
  .then((r) => {
    if (!r) return User.create({ name: config.admin.name, position: config.admin.position, id: config.admin.id, password: config.admin.password })
    return Promise.resolve(null)
  })
  .then((r) => {
    if (r) console.log(`admin: ${r.name} created!`)
  })
  .catch((e) => {
    console.error(e.message)
  })

// router 설정
app.use(index.routes(), index.allowedMethods());
app.use(user.routes(), user.allowedMethods());
app.use(token.routes(), token.allowedMethods());

app.on('error', function(err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx)
})

module.exports = app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`)
})
