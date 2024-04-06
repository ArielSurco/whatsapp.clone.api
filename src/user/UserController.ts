import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { ResponseError } from '../server/ResponseError'
import { ENV } from '../shared/constants/environment'
import { Authorized } from '../shared/types/Authorized'
import { Controller } from '../shared/types/Controller'

import { UserModel } from './models/UserModel'
import { UserLogin } from './schemas/UserLogin'
import { UserRegister } from './schemas/UserRegister'
import { UserInfo } from './types/UserInfo'

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

export const userInfo = Controller<never, Authorized, UserInfo>(async (req, res) => {
  const { userId } = req.body

  const foundUser = await UserModel.findById(userId)

  if (!foundUser) {
    throw new ResponseError(400, 'User not found')
  }

  res.status(200).json({
    id: foundUser.id,
    username: foundUser.username,
    email: foundUser.email,
  })
})

export const getUsers = Controller<never, Authorized, UserInfo[]>(async (req, res) => {
  // I want to allow optionally filtering by username
  // So I'm not validating if the query parameter exists
  const { username } = req.query
  const parsedUsername = typeof username === 'string' ? username : ''

  const users = await UserModel.find({
    username: { $regex: parsedUsername, $options: 'i' },
    isActive: true,
  }).select('id username email')

  const responseUsers: UserInfo[] = users.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
  }))

  res.status(200).json(responseUsers)
})
