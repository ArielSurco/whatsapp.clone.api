import cors from 'cors'
import express, { Application } from 'express'
import mongoose from 'mongoose'

import { ENV } from '../shared/constants/environment'

import { ErrorHandler } from './ErrorHandler'
import { routes } from './Routes'

export class Server {
  private app: Application

  constructor() {
    this.app = express()
    this.middlewares()
    this.routes()
    this.errorHandler()
  }

  private middlewares() {
    this.app.use(express.json())
    this.app.use(cors())
  }

  private routes() {
    routes.forEach(({ basePath, router }) => {
      this.app.use(basePath, router)
    })

    this.app.get('*', (_req, res) => {
      res.status(404).send('Not found')
    })
  }

  private errorHandler() {
    this.app.use(ErrorHandler)
  }

  private connectDB() {
    return mongoose.connect(ENV.MONGO_URI)
  }

  public async init() {
    await this.connectDB()

    this.app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`)
    })
  }
}
