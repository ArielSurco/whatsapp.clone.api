import { Controller } from '../shared/types/Controller'

import { UserRegister } from './schemas/UserRegister'

export const registerUser = Controller<never, UserRegister>((req, res) => {
  const { username, email, password } = req.body

  res.json({
    username,
    email,
    password,
  })
})
