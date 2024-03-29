import { Router } from 'express'

import { ValidateSchema } from '../shared/middlewares/ValidateSchema'

import { UserRegisterSchema } from './schemas/UserRegister'
import { registerUser } from './UserController'

const router = Router()

router.post('/register', ValidateSchema(UserRegisterSchema, 'body'), registerUser)

export const userRouter = {
  basePath: '/user',
  router,
}
