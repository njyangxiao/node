const Router = require('koa-router')
const jwt = require('koa-jwt')

const router = new Router({
  prefix: '/question/:questionId/answer/:answerId/comments'
})
const {
  secret
} = require('../config')

const auth = jwt({
  secret
})

// const {
//   delete: del  //替换引用
// } = require('../controllers/comments')

const {
  create,
  find,
  findById,
  deleteComment,
  update,
  checkCommentExist,
  checkCommentator
} = require('../controllers/comments')

router.post('/', auth, create) //创建问题
router.get('/', find) //查询问题
router.get('/:id', checkCommentExist, findById) //根据id查询问题
router.patch('/:id', auth, checkCommentExist, checkCommentator, update) //更新问题
router.delete('/:id', auth, checkCommentExist, checkCommentator, deleteComment) //删除问题

module.exports = router