import { Router } from 'express'

import { ValidateAuth } from '../shared/middlewares/ValidateAuth'
import { ValidateSchema } from '../shared/middlewares/ValidateSchema'

import { UserLoginSchema } from './schemas/UserLogin'
import { UserRegisterSchema } from './schemas/UserRegister'
import { loginUser, registerUser, userInfo } from './UserController'

const router = Router()

router.get('/me', ValidateAuth, userInfo)

router.post('/register', ValidateSchema(UserRegisterSchema, 'body'), registerUser)
router.post('/login', ValidateSchema(UserLoginSchema, 'body'), loginUser)

export const userRouter = {
  basePath: '/user',
  router,
}
