const mongoose = require('mongoose')
const {
  Schema,
  model
} = mongoose

const userSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  name: { //账号
    type: String,
    required: true
  },
  password: { //密码
    type: String,
    required: true,
    select: false
  },
  avatar_url: { //头像
    type: String
  },
  gender: { //性别
    type: String,
    enum: ['male', 'female'], //mongo数据库中的枚举
    default: 'male', //默认男
    required: true
  },
  headline: { //一句话介绍
    type: String
  },
  locations: { //居住地
    type: [{ //数组类型 里面是字符串
      type: Schema.Types.ObjectId,
      ref: "Topic"
    }],
    select: false
  },
  business: { //所在行业
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    select: false
  },
  employments: { //职业经历
    type: [{ //数组类型 里面是对象
      company: { //直接写字段名 //公司
        type: Schema.Types.ObjectId,
        ref: 'Topic'
      },
      job: { //直接写字段名 //职位
        type: Schema.Types.ObjectId,
        ref: 'Topic'
      }
    }],
    select: false
  },
  educations: { //教育经历
    type: [{
      school: { //学校
        type: Schema.Types.ObjectId,
        ref: 'Topic'
      },
      major: { //专业
        type: Schema.Types.ObjectId,
        ref: 'Topic'
      },
      diploma: { //学历
        type: Number,
        enum: [1, 2, 3, 4, 5] //分别代表学历等级
      },
      entrance_year: { //入学年份
        type: Number
      },
      graduation_year: { //毕业年份
        type: Number
      }
    }],
    select: false
  },
  following: { //关注的用户
    type: [{
      type: Schema.Types.ObjectId, //Schema中的类型  用户id类型
      ref: 'User', //引用
    }],
    select: false
  },
  followingTopic: { //关注的话题
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Topic'
    }],
    select: false
  },
  linkingAnswers: { //赞答案
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Answer'
    }],
    select: false
  },
  dislinkingAnswers: { //踩答案
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Answer'
    }],
    select: false
  },
  collectingAnswers: { //收藏的答案
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Answer'
    }],
    select: false
  }
})
module.exports = model('User', userSchema)