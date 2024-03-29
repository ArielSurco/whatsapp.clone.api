import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { ResponseError } from '../../server/ResponseError'
import { ENV } from '../constants/environment'

interface JWTPayload {
  id: number
}

export const ValidateAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.header('Authorization') ?? ''
  const token = authorizationHeader.replace('Bearer ', '')

  try {
    const { id } = jwt.verify(token, ENV.JWT_SECRET) as JWTPayload

    req.body.userId = id

    next()
  } catch (_error) {
    throw new ResponseError(401, 'Unauthorized')
  }
}
