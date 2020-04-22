const path = require('path')
class HomeCtl {
  index(ctx) {
    ctx.body = '这是首页'
  }
  upload(ctx) {
    const file = ctx.request.files.file
    const url = path.basename(file.path) //basename 就是文件名加拓展名
    ctx.body = {
      url: `${ctx.origin}/uploads/${url}` //返回文件路径  ctx.origin 在这里获取的是 http://localhost:3000
    }
  }
}
module.exports = new HomeCtl() //导出实例