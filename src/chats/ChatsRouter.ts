import { Router } from 'express'

import { ValidateAuth } from '../shared/middlewares/ValidateAuth'
import { ValidateSchema } from '../shared/middlewares/ValidateSchema'

import { createChat, getChat } from './ChatController'
import { ChatCreateSchema } from './schemas/ChatCreate'
import { ChatGetSchema } from './schemas/ChatGet'

const router = Router()

router.get('/:chatId', ValidateAuth, ValidateSchema(ChatGetSchema, 'params'), getChat)

router.post('/', ValidateAuth, ValidateSchema(ChatCreateSchema, 'body'), createChat)

export const chatsRouter = {
  basePath: '/chats',
  router,
}
