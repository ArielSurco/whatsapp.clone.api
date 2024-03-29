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

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  },
})
