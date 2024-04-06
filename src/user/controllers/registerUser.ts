import bcrypt from 'bcrypt'

import { ResponseError } from '../../server/ResponseError'
import { Controller } from '../../shared/types/Controller'
import { UserModel } from '../models/UserModel'
import { UserRegister } from '../schemas/UserRegister'

export const registerUser = Controller<never, UserRegister>(async (req, res) => {
  const { username, email, password } = req.body

  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const foundUser = await UserModel.findOne({
    $or: [{ username }, { email }],
  })

  if (foundUser) {
    throw new ResponseError(400, 'Already exists a user with this email or username')
  }

  const newUser = new UserModel({
    username,
    email,
    password: hashedPassword,
  })

  await newUser.save()

  res.status(201).json({ message: 'User created' })
})
