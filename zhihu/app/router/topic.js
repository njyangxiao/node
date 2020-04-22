const jwt = require('koa-jwt')
const Router = require('koa-router')

const {
  secret
} = require('../config')

const router = new Router({
  prefix: '/topics' //前缀
})
//判断登录
const auth = jwt({
  secret
})

const {
  find,
  findById,
  update,
  create,
  checkTopicExist,
  listFollowers,
  listQuestions
} = require('../controllers/topics')
router.get('/', find) //获取话题列表
router.post('/', auth, create) //创建话题
router.get('/:id', checkTopicExist, findById) //获取指定话题
router.patch('/:id', checkTopicExist, auth, update) //更新话题
router.get('/:id/listFollowers', checkTopicExist, listFollowers) //获取话题粉丝
router.get('/:id/listQuestions', checkTopicExist, listQuestions) //获取话题的问题


module.exports = router