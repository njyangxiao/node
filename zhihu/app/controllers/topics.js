const Topic = require('../models/topics')
const User = require('../models/users')
const Question = require('../models/questions')

class TopicCtl {

  //判断话题是否存在
  async checkTopicExist(ctx, next) {
    const user = await Topic.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '话题不存在')
    }
    await next()
  }
  //查询话题
  async find(ctx) {
    const {
      pageSize = 10
    } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const page_size = Math.max(pageSize * 1, 1) //转换成数组类型 每页多少项  Math.max(0,1) 选择较大的一项
    ctx.body = await Topic
      .find({
        name: new RegExp(ctx.query.q) ////关键词转换成正则表达式 模糊搜索
      })
      .limit(page_size)
      .skip(page * page_size) //skip 跳过page * pageSize项 limit返回pageSize条
  }
  // 根据id查询话题
  async findById(ctx) {
    const {
      fields = '' //如果不存在默认空字符串
    } = ctx.query //获取fields 字段
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const topic = await Topic.findById(ctx.params.id).select(selectFields)
    ctx.body = topic
  }
  //创建话题
  async create(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      avatar_url: {
        type: 'string',
        required: false
      },
      introduction: {
        type: 'string',
        required: false
      }
    })
    const {
      name
    } = ctx.request.body

    const repeatedTopic = await Topic.findOne({
      name
    })
    if (repeatedTopic) {
      ctx.throw(409, '话题已存在')
    }

    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }
  //更新话题
  async update(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false
      },
      avatar_url: {
        type: 'string',
        required: false
      },
      introduction: {
        type: 'string',
        required: false
      }
    })
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!topic) {
      ctx.throw(404)
    }
    ctx.body = topic

  }
  //获取话题粉丝
  async listFollowers(ctx) {
    const user = await User.find({
      followingTopic: ctx.params.id
    })
    ctx.body = user
  }
  //问题列表
  async listQuestions(ctx) {
    const question = await Question.find({
      topic: ctx.params.id
    })
    ctx.body = question
  }
}
module.exports = new TopicCtl()