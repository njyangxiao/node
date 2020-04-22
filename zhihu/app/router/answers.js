const Router = require('koa-router')
const jwt = require('koa-jwt')

const router = new Router({
  prefix: '/question/:questionId/answer'
})
const {
  secret
} = require('../config')

const auth = jwt({
  secret
})

const {
  create,
  find,
  findById,
  deleteAnswer,
  update,
  checkAnswerExist,
  checkAnserer
} = require('../controllers/answers')

router.post('/', auth, create) //创建问题
router.get('/', find) //查询问题
router.get('/:id', checkAnswerExist, findById) //根据id查询问题
router.patch('/:id', auth, checkAnswerExist, checkAnserer, update) //更新问题
router.delete('/:id', auth, checkAnswerExist, checkAnserer, deleteAnswer) //删除问题

module.exports = router