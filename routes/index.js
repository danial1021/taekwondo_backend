const router = require('koa-router')();

router.get('/', async (ctx) => {
  const { test } = ctx.request.query
  ctx.body = await 'test로 보낸 data: ' + test
  console.log(ctx.body)
});

module.exports = router;