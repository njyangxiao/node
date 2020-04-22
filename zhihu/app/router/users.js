const Router = require('koa-router')
const jwt = require('koa-jwt')

const {
  secret
} = require('../config')

const router = new Router({
  prefix: '/users' //前缀
})
//用户控制器
const {
  find,
  findById,
  create,
  update,
  del,
  login,
  checkOwner,
  listFollowing,
  follow,
  unfollow,
  listFollowers,
  checkUserExist,
  listFollowingTopic,
  followTopic,
  unfollowTopic,
  listQuestion,
  listLinkingAnswers,
  linkeAnswer,
  unlinkeAnswer,
  listDislinkingAnswers,
  dislinkeAnswer,
  undislinkeAnswer,
  listCollectingAnswers,
  collectAnswer,
  uncollectAnswer
} = require('../controllers/users')

//话题控制器
const {
  checkTopicExist //判断id是否存在
} = require('../controllers/topics')

const {
  checkAnswerExist //检查答案是否存在
} = require('../controllers/answers')

//认证中间件
const auth = jwt({
  secret
})


router.get('/', find) //获取用户列表
router.post('/', create) //创建用户
router.get('/:id', findById) //根据id查询用户
router.patch('/:id', auth, checkOwner, update) //更新用户 //put 是整体替换  patch是部分替换
router.delete('/:id', auth, checkOwner, del) //删除用户
router.post('/login', login) //登录
router.get('/:id/following', listFollowing) //获取关注人列表
router.get('/:id/listFollowers', listFollowers) //获取粉丝列表
router.put('/following/:id', auth, checkUserExist, follow); //关注用户
router.delete('/unfollow/:id', auth, checkUserExist, unfollow); //取消关注用户
router.get('/:id/listFollowingTopic', listFollowingTopic) //列出关注的话题
router.put('/followTopic/:id', auth, checkTopicExist, followTopic); //关注话题
router.delete('/unfollowTopic/:id', auth, checkTopicExist, unfollowTopic); //取消关注话题
router.get('/:id/listQuestion', listQuestion) //列出问题
router.get('/:id/listLinkingAnswers', listLinkingAnswers) //列出赞过的答案
router.put('/linkeAnswer/:id', auth, checkAnswerExist, linkeAnswer, undislinkeAnswer); //赞答案
router.delete('/unlinkeAnswer/:id', auth, checkAnswerExist, unlinkeAnswer); //取消赞答案
router.get('/:id/listDislinkingAnswers', listDislinkingAnswers) //列出踩过的答案
router.put('/dislinkeAnswer/:id', auth, checkAnswerExist, dislinkeAnswer, unlinkeAnswer); //踩答案
router.delete('/undislinkeAnswer/:id', auth, checkAnswerExist, undislinkeAnswer); //取消踩答案
router.get('/:id/listCollectingAnswers', listCollectingAnswers) //列出收藏的答案
router.put('/collectAnswer/:id', auth, checkAnswerExist, collectAnswer); //收藏答案
router.delete('/uncollectAnswer/:id', auth, checkAnswerExist, uncollectAnswer); //取消收藏答案


module.exports = router