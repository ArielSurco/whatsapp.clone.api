import { ResponseError } from '../../server/ResponseError'
import { Authorized } from '../../shared/types/Authorized'
import { Controller } from '../../shared/types/Controller'
import { ChatModel } from '../models/ChatModel'
import { ChatGet } from '../schemas/ChatGet'
import { getPrivateChatName } from '../utils/getPrivateChatName'

export const getChat = Controller<ChatGet, Authorized>(async (req, res) => {
  const { chatId } = req.params
  const { userId } = req.body

  const foundChat = await ChatModel.findById(chatId).populate('members', 'username')

  if (!foundChat) {
    throw new ResponseError(404, 'Chat not found')
  }

  const parsedName = foundChat.isGroup
    ? foundChat.name
    : await getPrivateChatName(
        userId,
        foundChat.members.map((member) => member.id.toString()),
      )

  res.status(200).json({
    id: foundChat.id,
    name: parsedName,
    members: foundChat.members,
    isGroup: foundChat.isGroup,
  })
})
