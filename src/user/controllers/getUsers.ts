import { ChatModel } from '../../chats/models/ChatModel'
import { Authorized } from '../../shared/types/Authorized'
import { Controller } from '../../shared/types/Controller'
import { UserModel } from '../models/UserModel'

interface ResponseItem {
  id: string
  username: string
  chatId?: string
}

export const getUsers = Controller<never, Authorized, ResponseItem[]>(async (req, res) => {
  // I want to allow optionally filtering by username
  // So I'm not validating if the query parameter exists
  const { username } = req.query
  const { userId } = req.body
  const parsedUsername = typeof username === 'string' ? username : ''

  const users = await UserModel.find({
    _id: { $ne: userId },
    username: { $regex: parsedUsername, $options: 'i' },
    isActive: true,
  })
    .select('id username email')
    .sort('username')

  const privateChats = await ChatModel.find({
    isGroup: false,
    members: userId,
  })

  const responseUsers: ResponseItem[] = users.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    chatId: privateChats.find((chat) => !chat.isGroup && chat.members.includes(user.id))?.id,
  }))

  res.status(200).json(responseUsers)
})
