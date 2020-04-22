REST 是什么？
万维网软件架构的风格

REST 6 个限制
1、客户端-服务器(Client-Server) CS 架构
。关注点分离
。服务端专注数据存储，提升了简单性
。前端专注用户界面，提升了可移植性
2、无状态(Stateless)
。所有的用户会话信息都保存在客户端
。每次请求必须包括所有信息，不能依赖上下文信息
。服务端不用保存会话信息，提升了简单性，可靠性，可见性
3、缓存(Cache)
。所有服务端响应都要被标为可缓存或不可缓存
。减少前后端交互，提升了性能
4、统一接口(Uniform Interface) //特点
。接口设计尽可能统一通用，提升了简单性，可见性
。接口与实现解耦，使前后端可以独立开发迭代
5、分层系统(Layered System)
。每层只知道相邻的一层，后面隐藏的就不知道了
。客户端不知道是和代理还是真实服务器通信
。其他层：安全层、负载均衡、缓存层等
6、按需代码(Code-On-Demand 可选)
。客户端可以下载运行服务端传来的代码(比如 JS)
。减少了一些功能，简化了客户端

HTTP options 方法的作用是什么？
检测服务器所支持的请求方法

npm init 初始化一个项目 安装依赖
npm i koa --save 安装 koa
const Koa = require('koa') //引入 koa
const app = new Koa() //实例化 koa

async await 用法
app.use(async (ctx, next) => {
await next() //先执行下一个中间件 执行完后再继续执行后面的代码
console.log('第一个')
})
app.use(async (ctx, next) => {
console.log('第二个')
})

安装 koa-router
npm i koa-router --save
const Router = require('koa-router') //引入 koa-router
const app = new Koa() //创建实例
app.use(router.routes())//app 中注册 router

//自定义路由

<!-- // app.use(async (ctx) => {
// if (ctx.url === '/') {
// ctx.body = "这是首页"
// } else if (ctx.url == '/users') {
// if (ctx.method === 'GET') {
// ctx.body = '用户列表'
// } else if (ctx.method === 'POST') {
// ctx.body = '创建用户'
// } else {
// ctx.status = 405
// }
// } else if (ctx.url.match(/\/users\/\w+/)) {
// const userId = ctx.url.match(/\/users\/(\w+)/)[1]
// ctx.body = '用户 id=' + userId
// } else {
// ctx.status = 404
// }
// })

// //自己编写错误处理中间件 放到所有中间件最前面
// app.use(async (ctx, next) => {
// // 需要 throw 抛出异常 才能用 try catch
// try {
// await next()
// } catch (error) {
// ctx.status = error.status || error.statusCode || 500
// ctx.body = {
// message: error.message
// }
// }
// }) -->

安装解析请求体的中间件 koa-bodyparser //后面会替换成 koa-body 因为 bodyparser 只支持 JSON 和 form 上传 不支持文件上传 上传图片需要用 koa-body
npm i koa-bodyparser --save
const bodyparser = require('koa-bodyparser') 引入
app.use(bodyparser()) app 中注册

安装 koa-json-error
npm i koa-json-error --save
const error = require('koa-json-error')
根据环境变量 是否显示 stack 字段
app.use(error({
postFormat: (e, {
stack,
...rest
}) => process.env.NODE_ENV === 'production' ? rest : {
stack,
rest
}
}))

安装 npm i cross-env --save-dev 跨平台设置环境变量 dev 表示在开发阶段使用
"scripts":{
"start":"coss-env NODE_ENV=production node app", //生产环境脚本
"dev":"nodemon app" //开发环境脚本
}

安装 koa-parameter 校验参数
npm i koa-parmeter --save
app.use(bodyparser())//放到请求体后面
app.use(parameter(app)) //传入 app 就可以全局使用了

安装 mongoose
npm i mongoose --save
const mongoose = require('mongoose')

show dbs
查看显示所有数据库
db
查看当前操作的数据库
use 数据库名称
切换到指定数据库（如果没有会创建）
插入数据

show collections
查看当前数据库的集合

安装 jsonwebtoken
npm i jsonwebtoken
const jwt = require("jsonwebtoken") //引入 jwt
token = jwt.sign({name:'lwis'},'secret')//签名 生成 token //secret 为密钥
jwt.decode(token) //就可以解码看到信息

const token= jsonwebtoken.sign({
id,
name
}, secret, {
expiresIn: '1d'
}) //验证 通过密钥(secret)验证 token expiresIn 为有效期 一天(1d)

jsonwebtoken.verify(token, secret)//验证 token 有没有篡改过

postman 中设置全局变量 {{token}}
var jsonData = pm.response.json()
pm.globals.set("token", jsonData.token);

//自定义认证中间件

<!-- const auth = async (ctx, next) => {
const {
authorization = ''
} = ctx.request.header
const token = authorization.replace('Bearer ', '') // 去掉 token 前面的 Bearer "Bearer "后面有个空格
try { //捕获错误
const user = jsonwebtoken.verify(token, secret)
ctx.state.user = user //放用户信息
} catch (err) {
ctx.throw(401, err.message)
}
// 如果没有问题 执行后面的代码
await next()
} -->

安装 koa-jwt //校验用户是否是本人 校验用户权限等
npm i koa-jwt --save
//中间件
const auth = jwt({
secret
})

安装 koa-body
npm i koa-body --save
const Koabody = require('koa-body')
app.use(Koabody({
multipart: true, //支持文件格式
formidable: {
uploadDir: path.join(\_\_dirname, '/public/uploads'), //设置上传目录
keepExtensions: true //保留拓展名
}
}))

安装 koa-static //生成图片链接
npm i koa-static --save
const koaStatic = require('koa-static')
app.use(koaStatic(path.join(\_\_dirname, 'public')))//参数为指定目录

me = await User.findById(ctx.state.user.\_id).select('+following') //获取本人信息 注意：\_id 不是 id
me.following.includes(ctx.params.id) //判断数组中是否包含

 <!-- if (!me.following.map(id => id.tosting()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
    } -->
