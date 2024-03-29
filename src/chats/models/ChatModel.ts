import { model, Schema } from 'mongoose'

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
  isGroup: {
    type: Boolean,
    required: true,
  },
})

export const ChatModel = model('Chat', ChatSchema)
