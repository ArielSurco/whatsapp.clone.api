import { Router } from 'express'

import { ValidateAuth } from '../shared/middlewares/ValidateAuth'
import { ValidateSchema } from '../shared/middlewares/ValidateSchema'

import { getUserInfo } from './controllers/getUserInfo'
import { getUsers } from './controllers/getUsers'
import { loginUser } from './controllers/loginUser'
import { registerUser } from './controllers/registerUser'
import { UserLoginSchema } from './schemas/UserLogin'
import { UserRegisterSchema } from './schemas/UserRegister'

const router = Router()

router.get('/', ValidateAuth, getUsers)
router.get('/me', ValidateAuth, getUserInfo)

router.post('/register', ValidateSchema(UserRegisterSchema, 'body'), registerUser)
router.post('/login', ValidateSchema(UserLoginSchema, 'body'), loginUser)

export const userRouter = {
  basePath: '/user',
  router,
}
