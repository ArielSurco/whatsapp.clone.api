import { ResponseError } from '../../server/ResponseError'
import { Authorized } from '../../shared/types/Authorized'
import { Controller } from '../../shared/types/Controller'
import { ChatModel } from '../models/ChatModel'
import { MessageModel } from '../models/MessageModel'
import { ChatGet } from '../schemas/ChatGet'
import { MessageCreate } from '../schemas/MessageCreate'

export const sendMessage = Controller<ChatGet, Authorized & MessageCreate>(async (req, res) => {
  const { chatId } = req.params
  const { userId, text } = req.body

  const chatExists = await ChatModel.exists({ _id: chatId })

  if (!chatExists) {
    throw new ResponseError(404, 'Chat not found')
  }

  const foundChat = await ChatModel.findOne({ _id: chatId, members: userId })

  if (!foundChat) {
    throw new ResponseError(403, 'You are not a member of this chat')
  }

  const newMessage = new MessageModel({ text, sender: userId })

  foundChat.messages.push(newMessage)
  foundChat.lastMessage = newMessage
  foundChat.updatedAt = new Date()

  await foundChat.save()

  await newMessage.populate('sender', 'username')

  res.status(201).json({
    id: newMessage.id,
    text: newMessage.text,
    sender: newMessage.sender,
    createdAt: newMessage.createdAt,
  })
})
