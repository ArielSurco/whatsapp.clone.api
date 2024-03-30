import { ResponseError } from '../server/ResponseError'
import { Authorized } from '../shared/types/Authorized'
import { Controller } from '../shared/types/Controller'
import { UserModel } from '../user/models/UserModel'

import { ChatModel } from './models/ChatModel'
import { MessageModel } from './models/MessageModel'
import { ChatCreate } from './schemas/ChatCreate'
import { ChatGet } from './schemas/ChatGet'
import { MessageCreate } from './schemas/MessageCreate'

export const createChat = Controller<never, ChatCreate & Authorized>(async (req, res) => {
  const { userId, name, members, isGroup } = req.body

  if (!isGroup && members.length !== 1) {
    throw new ResponseError(
      400,
      'Cannot create a chat with more than one member if it is not a group chat',
    )
  }

  const validMembers = await UserModel.find({ $or: [{ _id: userId }, { _id: { $in: members } }] })

  if (validMembers.length !== members.length + 1) {
    throw new ResponseError(400, 'One or more members are invalid')
  }

  if (isGroup && !name) {
    throw new ResponseError(400, 'Group chat must have a name')
  }

  const newChat = new ChatModel({
    name,
    members: validMembers,
    isGroup,
  })

  await newChat.save()

  res.status(201).json({ message: 'Chat created successfully', chatId: newChat.id })
})

export const getChat = Controller<ChatGet, Authorized>(async (req, res) => {
  const { chatId } = req.params

  const foundChat = await ChatModel.findById(chatId).populate('members', 'username')

  if (!foundChat) {
    throw new ResponseError(404, 'Chat not found')
  }

  res.status(200).json({
    id: foundChat.id,
    name: foundChat.name,
    members: foundChat.members,
    isGroup: foundChat.isGroup,
  })
})

export const getChats = Controller<never, Authorized>(async (req, res) => {
  const { userId } = req.body

  const chats = await ChatModel.find({
    members: userId,
    // Don't select non-group chats without messages
    $or: [{ isGroup: true }, { messages: { $exists: true, $ne: [] } }],
  })
    .select('id name lastMessage isGroup')
    .populate('lastMessage.sender', 'username')

  res.status(200).json(chats)
})

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

export const getMessages = Controller<ChatGet, Authorized>(async (req, res) => {
  const { chatId } = req.params

  const foundChat = await ChatModel.findById(chatId).populate('messages.sender', 'username')

  if (!foundChat) {
    throw new ResponseError(404, 'Chat not found')
  }

  res.status(200).json(foundChat.messages)
})
