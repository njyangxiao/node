const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const Question = require('../models/questions')
const Answer = require('../models/answers')
const {
  secret
} = require('../config')

class UsersCtl {
  //查询全部
  async find(ctx) {
    // ctx.body = await User.find().select('-password') //不显示密码 -为不显示 + 为显示
    const {
      pageSize = 10
    } = ctx.query

    const page = Math.max(ctx.query.page * 1, 1) - 1
    const page_size = Math.max(pageSize * 1, 1)
    ctx.body = await User
      .find({
        name: new RegExp(ctx.query.q) //关键词转换成正则表达式  模糊搜索
      })
      .limit(page_size)
      .skip(page * page_size)
  }
  //条件查询
  async findById(ctx) {
    // ctx.throw(412,'先决条件失败')//报412错误

    // ctx.body = db[ctx.params.id * 1]
    const {
      fields = ''
    } = ctx.query;
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
    const populate = fields.split(';').filter(f => f).map(f => {
      if (f === 'employments') {
        return 'employments.company employments.job'
      }
      if (f === 'educations') {
        return 'educations.school educations.major'
      }
      return f
    }).join(' ')
    // select("+business +educations")
    const user = await User.findById(ctx.params.id).select(selectFields).populate(populate)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }

    ctx.body = user
  }
  //创建
  async create(ctx) {
    // 校验
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    })

    const {
      name
    } = ctx.request.body

    const repeatedUser = await User.findOne({
      name
    })

    if (repeatedUser) {
      ctx.throw(409, '用户已存在')
    }

    const user = await new User(ctx.request.body).save();
    ctx.body = user
  }

  //控制器 是否是拥有者
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
  //检测用户是否存在 //中间件
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    await next()
  }

  // 更新
  async update(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false
      },
      password: {
        type: 'string',
        required: false
      },
      avatar_url: {
        type: 'string',
        required: false
      },
      gender: {
        type: 'string',
        required: false
      },
      headline: {
        type: 'string',
        required: false
      },
      locations: {
        type: 'array',
        itemType: 'string',
        required: false
      },
      business: {
        type: 'string',
        required: false
      },
      employments: {
        type: 'array',
        itemType: 'object',
        required: false

      },
      educations: {
        type: 'array',
        itemType: 'object',
        required: false

      }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user

  }
  // 删除
  async del(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  }

  async login(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    })
    ctx.body = 'ss'
    const user = await User.findOne(ctx.request.body)
    if (!user) {
      ctx.throw(401, '用户名或密码错误')
    }
    const {
      _id,
      name
    } = user
    const token = jsonwebtoken.sign({
      _id,
      name
    }, secret, {
      expiresIn: '1d'
    })
    //返回token
    ctx.body = {
      token
    }
  }
  //获取关注用户列表
  async listFollowing(ctx) {
    const user = await User.findById(ctx.params.id).select('+following').populate('following') //populate('following')展示 following 具体信息
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user.following
  }
  //获取粉丝
  async listFollowers(ctx) {
    const users = await User.find({
      following: ctx.params.id
    })
    ctx.body = users
  }
  //关注用户
  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following') //获取本人信息
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save() //保存到数据库
    }
    ctx.status = 204
  }
  //取消关注用户
  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following') //获取本人信息
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.following.splice(index, 1)
      me.save() //保存到数据库
    }
    ctx.status = 204
  }
  //获取关注话题列表
  async listFollowingTopic(ctx) {
    const user = await User.findById(ctx.params.id).select('+followingTopic').populate('followingTopic')
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user.followingTopic
  }

  //关注话题
  async followTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+followingTopic')
    if (!me.followingTopic.map(id => id.toString()).includes(ctx.params.id)) {
      me.followingTopic.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }
  //取消关注话题
  async unfollowTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+followingTopic')
    const index = me.followingTopic.map(id => id.toString()).indexOf(ctx.params.id)
    console.log(index)
    if (index != -1) {
      me.followingTopic.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
  //列出问题
  async listQuestion(ctx) {
    const questions = await Question.find({
      questioner: ctx.params.id
    })
    ctx.body = questions
  }
  //列出赞过的答案
  async listLinkingAnswers(ctx) {
    const user = await User.findById(ctx.params.id).select('+linkingAnswers').populate('linkingAnswers')
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user.linkingAnswers
  }
  //赞答案
  async linkeAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+linkingAnswers')
    if (!me.linkingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.linkingAnswers.push(ctx.params.id)
      me.save()
      await Answer.findByIdAndUpdate(ctx.params.id, {
        $inc: {
          voteCount: 1 //答案的投票数增加1
        }
      })
    }
    ctx.status = 204
    await next()
  }
  //取消赞过的答案
  async unlinkeAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+linkingAnswers')
    const index = me.linkingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if (index != -1) {
      me.linkingAnswers.splice(index, 1)
      me.save()
      await Answer.findByIdAndUpdate(ctx.params.id, {
        $inc: {
          voteCount: -1 //投票数-1
        }
      })
    }
    ctx.status = 204
  }


  //列出踩过的答案
  async listDislinkingAnswers(ctx) {
    const user = await User.findById(ctx.params.id).select('+dislinkingAnswers').populate('dislinkingAnswers')
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user.dislinkingAnswers
  }
  //踩答案
  async dislinkeAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+dislinkingAnswers')
    if (!me.dislinkingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.dislinkingAnswers.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
    await next()
  }
  //取消踩过的答案
  async undislinkeAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+dislinkingAnswers')
    const index = me.dislinkingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if (index != -1) {
      me.dislinkingAnswers.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
  //列出收藏的答案
  async listCollectingAnswers(ctx) {
    const user = await User.findById(ctx.params.id).select('+collectingAnswers').populate('collectingAnswers')
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user.collectingAnswers
  }
  //收藏答案
  async collectAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers')
    if (!me.collectingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.collectingAnswers.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }
  //取消收藏
  async uncollectAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers')
    const index = me.collectingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if (index != -1) {
      me.collectingAnswers.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
}

module.exports = new UsersCtl()