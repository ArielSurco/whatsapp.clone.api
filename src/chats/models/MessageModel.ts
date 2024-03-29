import { model, Schema } from 'mongoose'

export const MessageSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const MessageModel = model('Message', MessageSchema)
