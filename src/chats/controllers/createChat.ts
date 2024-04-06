import { ResponseError } from '../../server/ResponseError'
import { Authorized } from '../../shared/types/Authorized'
import { Controller } from '../../shared/types/Controller'
import { UserModel } from '../../user/models/UserModel'
import { ChatModel } from '../models/ChatModel'
import { ChatCreate } from '../schemas/ChatCreate'

export const createChat = Controller<never, ChatCreate & Authorized>(async (req, res) => {
  const { name, members, isGroup } = req.body

  if (!isGroup && members.length > 2) {
    throw new ResponseError(
      400,
      'Cannot create a chat with more than two members if it is not a group chat',
    )
  }

  const validMembers = await UserModel.find({ _id: { $in: members } })

  if (validMembers.length !== members.length) {
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
