const Answers = require('../models/answers')

class AnswersCtl {

  //查看答案列表
  async find(ctx) {
    const {
      PageSize = 10
    } = ctx.query;

    const page = Math.max(ctx.query.page * 1, 1) - 1
    const page_size = Math.max(PageSize * 1, 1)
    const q = new RegExp(ctx.query.q) //用于模糊查询
    const answers = await Answers.find({
      content: q,
      questionId: ctx.params.questionId
    }).limit(page_size).skip(page_size * page)
    ctx.body = answers
  }
  //判断问题是否存在
  async checkAnswerExist(ctx, next) {
    const answer = await Answers.findById(ctx.params.id).select('+answerer')
    if (!answer) {
      ctx.throw(404, '答案不存在')
    }
    //只有路由中包含 questionId 的时候才会检查  (只有在删改查答案的时候才检查 赞、踩的时候 不检查)
    if (ctx.params.questionId && answer.questionId !== ctx.params.questionId) {
      ctx.throw(404, '该问题下没有此答案')
    }
    ctx.state.answer = answer
    await next()
  }
  // 根据id查找答案
  async findById(ctx) {
    const {
      fields = ''
    } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const answer = await Answers.findById(ctx.params.id).select(selectFields)
    ctx.body = answer
  }
  // 创建答案
  async create(ctx) {
    ctx.verifyParams({
      content: {
        type: 'string',
        required: true
      }
    })
    const answerer = ctx.state.user._id
    const questionId = ctx.params.questionId
    const answer = await new Answers({
      ...ctx.request.body,
      answerer: answerer,
      questionId: questionId
    }).save()
    ctx.body = answer
  }
  //检查回答者
  async checkAnserer(ctx, next) {
    const {
      answer
    } = ctx.state

    if (answer.answerer.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
  //更新问题
  async update(ctx) {
    ctx.verifyParams({
      content: {
        type: 'string',
        required: true
      }
    })
    await ctx.state.answer.update(ctx.request.body)
    ctx.body = ctx.state.answer
  }
  //删除问题
  async deleteAnswer(ctx) {
    await Answers.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}

module.exports = new AnswersCtl()