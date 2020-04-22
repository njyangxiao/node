const jwt = require('koa-jwt')
const Router = require('koa-router')
const router = new Router({
  prefix: '/question'
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
  deleteQuestion,
  update,
  checkQuestionExist,
  checkQuestioner
} = require('../controllers/questions')

router.post('/', auth, create) //创建问题
router.get('/', find) //查询问题
router.get('/:id', checkQuestionExist, findById) //根据id查询问题
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, update) //更新问题
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, deleteQuestion) //删除问题

module.exports = router