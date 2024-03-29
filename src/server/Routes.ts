import { Router } from 'express'

import { userRouter } from '../user/UserRouter'

export interface RouterHandler {
  basePath: string
  router: Router
}

export const routes: RouterHandler[] = [userRouter]
