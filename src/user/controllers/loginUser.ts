import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { ResponseError } from '../../server/ResponseError'
import { ENV } from '../../shared/constants/environment'
import { Controller } from '../../shared/types/Controller'
import { UserModel } from '../models/UserModel'
import { UserLogin } from '../schemas/UserLogin'

export const loginUser = Controller<never, UserLogin>(async (req, res) => {
  const { username, password } = req.body

  const foundUser = await UserModel.findOne({ username })

  if (!foundUser) {
    throw new ResponseError(400, 'User not found')
  }

  const isPasswordValid = await bcrypt.compare(password, foundUser.password ?? '')

  if (!isPasswordValid) {
    throw new ResponseError(400, 'Invalid password')
  }

  const token = jwt.sign({ id: foundUser.id }, ENV.JWT_SECRET)

  res.status(200).json({
    token,
  })
})
