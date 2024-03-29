import { z } from 'zod'

export const ChatGetSchema = z.object({
  chatId: z.string(),
})

export type ChatGet = z.infer<typeof ChatGetSchema>
