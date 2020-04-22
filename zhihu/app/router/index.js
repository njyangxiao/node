// 批量读取文件 批量注册
const fs = require('fs')
module.exports = (app) => {
  // 同步读取文件 返回当前文件名 数组
  fs.readdirSync(__dirname).forEach(file => {
    if (file === "index.js") {
      return
    }
    const route = require(`./${file}`) //文件引入
    app.use(route.routes()).use(route.allowedMethods()) //allowedMethods 响应options  可以用哪些方法请求 POST GET
  })
}