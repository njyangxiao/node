const Comment = require('../models/comments')

class CommentCtl {

  //查看评论是否存在
  async checkCommentExist(ctx, next) {
    const comment = await Comment.findById(ctx.params.id).select('+commentator')
    if (!comment) {
      ctx.throw(404, '评论不存在')
    }
    if (ctx.params.questionId && comment.questionId.toString() !== ctx.params.questionId) {
      ctx.throw(404, '该问题下没有此评论')
    }
    if (ctx.params.answerId && comment.answerId.toString() !== ctx.params.answerId) {
      ctx.throw(404, '该答案下没有此评论')
    }
    ctx.state.comment = comment
    await next()
  }
  //检查权限
  async checkCommentator(ctx, next) {
    const {
      comment
    } = ctx.state
    if (comment.commentator.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  //评论列表
  async find(ctx) {
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const {
      pageSize = 10
    } = ctx.query
    const {
      rootCommentId
    } = ctx.query
    const page_size = Math.max(pageSize * 1, 1)
    const q = new RegExp(ctx.query.q)
    const {
      questionId,
      answerId
    } = ctx.params
    ctx.body = await Comment.find({
      content: q,
      questionId,
      answerId,
      rootCommentId
    }).limit(page_size).skip(page * page_size).populate('commentator replyTo')
  }
  // 根据id查看评论
  async findById(ctx) {
    const {
      fields = ''
    } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator')
    ctx.body = comment
  }
  //创建评论
  async create(ctx) {
    ctx.verifyParams({
      content: {
        type: 'string',
        required: true
      },
      rootCommentId: {
        type: 'string',
        required: false
      },
      replyTo: {
        type: 'string',
        required: false
      }
    })
    const commentator = ctx.state.user._id
    const {
      questionId,
      answerId
    } = ctx.params
    const comment = await new Comment({
      ...ctx.request.body,
      questionId,
      answerId,
      commentator
    }).save()
    ctx.body = comment
  }

  //更新评论
  async update(ctx) {
    ctx.verifyParams({
      content: {
        type: 'string',
        required: true
      }
    })
    const {
      content
    } = ctx.request.body
    await ctx.state.comment.update({
      content
    })
    ctx.body = ctx.state.comment
  }
  //删除评论
  async deleteComment(ctx) {
    await Comment.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}

module.exports = new CommentCtl()