import { Router } from 'express'

export interface RouterHandler {
  basePath: string
  router: Router
}

export const routes: RouterHandler[] = []
