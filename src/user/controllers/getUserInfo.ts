import { ResponseError } from '../../server/ResponseError'
import { Authorized } from '../../shared/types/Authorized'
import { Controller } from '../../shared/types/Controller'
import { UserModel } from '../models/UserModel'

interface Response {
  id: string
  username: string
  email: string
}

export const getUserInfo = Controller<never, Authorized, Response>(async (req, res) => {
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
