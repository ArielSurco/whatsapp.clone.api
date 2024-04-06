import { Authorized } from '../../shared/types/Authorized'
import { Controller } from '../../shared/types/Controller'
import { ChatModel } from '../models/ChatModel'
import { getPrivateChatName } from '../utils/getPrivateChatName'

export const getChats = Controller<never, Authorized>(async (req, res) => {
  const { userId } = req.body

  const chats = await ChatModel.find({
    members: userId,
    // Don't select non-group chats without messages
    $or: [{ isGroup: true }, { messages: { $exists: true, $ne: [] } }],
  })
    .select('id name lastMessage isGroup members')
    .populate('lastMessage.sender', 'username')

  const chatsResponse = await Promise.all(
    chats.map(async (chat) => ({
      id: chat.id,
      name: chat.isGroup
        ? chat.name
        : await getPrivateChatName(
            userId,
            chat.members.map((member) => member.toString()),
          ),
      lastMessage: chat.lastMessage,
      isGroup: chat.isGroup,
    })),
  )

  res.status(200).json(chatsResponse)
})
