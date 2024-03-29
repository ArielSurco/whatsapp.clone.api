import { z } from 'zod'

export const UserRegisterSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8),
})

export type UserRegister = z.infer<typeof UserRegisterSchema>
