import { ResponseError } from '../../server/ResponseError'
import { DEFAULT_PAGINATION } from '../../shared/constants/defaultPagination'
import { Authorized } from '../../shared/types/Authorized'
import { Controller } from '../../shared/types/Controller'
import { PaginationResponse } from '../../shared/types/PaginationResponse'
import { ChatModel } from '../models/ChatModel'
import { ChatGet } from '../schemas/ChatGet'

export const getMessages = Controller<ChatGet, Authorized, PaginationResponse>(async (req, res) => {
  const { chatId } = req.params

  const limitQuery = Number(req.query.limit)
  const offsetQuery = Number(req.query.offset)

  // Validates if limit and offset are valid numbers
  // Doesn't throw errors, but avoid using invalida or unexpected values
  const limit = limitQuery && limitQuery >= 1 ? limitQuery : DEFAULT_PAGINATION.limit
  const offset = offsetQuery && offsetQuery >= 0 ? offsetQuery : DEFAULT_PAGINATION.offset

  const foundChat = await ChatModel.findById(chatId)
    .select('messages')
    .populate('messages.sender', 'username')

  if (!foundChat) {
    throw new ResponseError(404, 'Chat not found')
  }

  // TODO: Perform pagination, maybe using MessageSchema as a Model insteand of a Subdocument of ChatModel
  const messages = foundChat.messages
    .reverse()
    .slice(offset, offset + limit)
    .reverse()
  const total = foundChat.messages.length

  res.status(200).json({
    results: messages,
    total: total,
  })
})
