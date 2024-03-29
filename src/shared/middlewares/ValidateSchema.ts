import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodError } from 'zod'

import { ResponseError } from '../../server/ResponseError'

export const ValidateSchema =
  (schema: AnyZodObject, type: 'body' | 'params') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[type])
      next()
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new ResponseError(400, 'Some fields are invalid', error.formErrors.fieldErrors)
      }

      throw new ResponseError(500, 'Internal server error')
    }
  }
