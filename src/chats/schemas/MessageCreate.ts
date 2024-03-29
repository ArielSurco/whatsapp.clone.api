import { z } from 'zod'

export const MessageCreateSchema = z.object({
  text: z.string(),
})

export type MessageCreate = z.infer<typeof MessageCreateSchema>
