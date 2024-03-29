import { NextFunction, Request, Response } from 'express'

import { ENV } from '../shared/constants/environment'

import { ResponseError } from './ResponseError'

export const ErrorHandler = (
  err: ResponseError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err)
  }

  const errorStatus = err.statusCode ?? 500
  const errorMessage = err.message ?? 'Internal server error'
  const showStack = ENV.NODE_ENV === 'development'

  res.status(errorStatus)
  res.json({
    status: errorStatus,
    message: errorMessage,
    issues: err.issues,
    stack: showStack ? err.stack : undefined,
  })
}
