const Koa = require('koa')
const Koabody = require('koa-body')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const koaStatic = require('koa-static')
const path = require('path')
const mongoose = require('mongoose')
const app = new Koa()
const routing = require('./router/index')



mongoose.connect('mongodb://localhost:27017/zhihu', {
  useNewUrlParser: true
});


app.use(error({
  postFormat: (e, {
    stack,
    ...rest
  }) => process.env.NODE_ENV === 'production' ? rest : {
    stack,
    rest
  }
}))
app.use(koaStatic(path.join(__dirname, 'public'))) //参数为指定目录
app.use(Koabody({
  multipart: true, //支持文件格式
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'), //设置上传目录
    keepExtensions: true //保留拓展名
  }
}))
app.use(parameter(app))
routing(app)
app.listen(3000, () => {
  console.log('启动了')
})