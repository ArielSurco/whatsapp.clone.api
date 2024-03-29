import { model, Schema } from 'mongoose'

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 30,
  },
  email: {
    type: String,
    required: true,
    email: true,
  },
  password: String,
  isActive: {
    type: Boolean,
    default: true,
  },
})

export const UserModel = model('User', UserSchema)
