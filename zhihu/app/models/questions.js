const mongoose = require('mongoose')
const {
  Schema,
  model
} = mongoose
const questionSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  title: { //标题
    type: String,
    required: true
  },
  description: { //描述
    type: String
  },
  questioner: { //提问者
    type: Schema.Types.ObjectId, //提问者是问题的引用 用户id
    ref: 'User',
    required: true,
    select: false
  },
  topic: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Topic'
    }],
    select: false
  }
})
module.exports = model('Question', questionSchema)