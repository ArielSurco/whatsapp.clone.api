import { Router } from 'express'

import { ValidateAuth } from '../shared/middlewares/ValidateAuth'
import { ValidateSchema } from '../shared/middlewares/ValidateSchema'

import { createChat } from './controllers/createChat'
import { getChat } from './controllers/getChat'
import { getChats } from './controllers/getChats'
import { getMessages } from './controllers/getMessages'
import { sendMessage } from './controllers/sendMessage'
import { ChatCreateSchema } from './schemas/ChatCreate'
import { ChatGetSchema } from './schemas/ChatGet'
import { MessageCreateSchema } from './schemas/MessageCreate'

const router = Router()

router.get('/', ValidateAuth, getChats)
router.get('/:chatId', ValidateAuth, ValidateSchema(ChatGetSchema, 'params'), getChat)
router.get('/:chatId/messages', ValidateAuth, ValidateSchema(ChatGetSchema, 'params'), getMessages)

router.post('/', ValidateAuth, ValidateSchema(ChatCreateSchema, 'body'), createChat)
router.post(
  '/:chatId/messages',
  ValidateAuth,
  ValidateSchema(ChatGetSchema, 'params'),
  ValidateSchema(MessageCreateSchema, 'body'),
  sendMessage,
)

export const chatsRouter = {
  basePath: '/chats',
  router,
}
