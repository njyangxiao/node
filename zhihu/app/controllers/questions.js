const Question = require('../models/questions')

class QuestionCtl {
  //中间件 判断问题是否存在
  async checkQuestionExist(ctx, next) {

    const question = await Question.findById(ctx.params.id).select('+questioner')
    if (!question) {
      ctx.throw(404, '问题不存在')
    }
    ctx.state.question = question //把查询到的question 放到state里面
    await next()
  }
  //查询问题
  async find(ctx) {
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const {
      pageSize = 10
    } = ctx.query
    const q = new RegExp(ctx.query.q)
    const page_size = Math.max(pageSize * 1, 1)
    const question = await Question.find({
      $or: [{
        title: q
      }, {
        description: q
      }]
    }).limit(page_size).skip(page_size * page)
    ctx.body = question
  }
  //根据id查询问题
  async findById(ctx) {
    const {
      fields = ''
    } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const question = await Question.findById(ctx.params.id).select(selectFields).populate('questioner topic') //前面用ref的地方 才需要populate 两者相互依赖缺一不可
    if (!question) {
      ctx.throw(404, '问题不存在')
    }
    ctx.body = question
  }
  //创建问题
  async create(ctx) {
    ctx.verifyParams({
      title: {
        type: 'string',
        required: true
      },
      description: {
        type: 'string',
        required: false
      }
    })
    // const {
    //   title
    // } = ctx.request.body
    // const repeatedQuestion = await Question.findOne({
    //   title
    // })
    // if (repeatedQuestion) {
    //   ctx.throw(409, '问题已存在')
    // }
    const question = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user._id
    }).save()
    ctx.body = question

  }

  //判断用户有没有权限
  async checkQuestioner(ctx, next) {
    const {
      question
    } = ctx.state
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  //更新问题
  async update(ctx) {
    console.log(2222)
    ctx.verifyParams({
      title: {
        type: 'string',
        required: true
      },
      description: {
        type: 'string',
        required: false
      }
    })
    await ctx.state.question.update(ctx.request.body)
    ctx.body = ctx.state.question
  }

  async deleteQuestion(ctx) {
    await ctx.state.question.delete()
    ctx.status = 204
  }


}

module.exports = new QuestionCtl()