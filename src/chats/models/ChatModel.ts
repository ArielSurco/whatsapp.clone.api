import { model, Schema } from 'mongoose'

import { MessageSchema } from './MessageModel'

const ChatSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  messages: {
    type: [MessageSchema],
    default: [],
  },
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    default: null,
  },
  isGroup: {
    type: Boolean,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const ChatModel = model('Chat', ChatSchema)

ChatSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  },
})
