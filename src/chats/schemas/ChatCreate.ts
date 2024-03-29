import { z } from 'zod'

export const ChatCreateSchema = z.object({
  name: z.string(),
  members: z.array(z.string()).nonempty(),
  isGroup: z.boolean(),
})

export type ChatCreate = z.infer<typeof ChatCreateSchema>
