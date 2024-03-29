/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'

type ControllerCallback<
  ParamsDictionary = any,
  RequestBody = Record<string, any>,
  ResponseBody = unknown,
> = (
  req: Request<ParamsDictionary, ResponseBody, RequestBody>,
  res: Response,
  next: NextFunction,
) => Promise<void> | void

/**
 * Wraps a controller function with a try/catch block to catch any errors and pass them to the ErrorHandler middleware
 * @param controller The controller function to wrap
 * @returns The wrapped controller function
 */
export const Controller = <
  ParamsDictionary = any,
  RequestBody = Record<string, any>,
  ResponseBody = unknown,
>(
  controller: ControllerCallback<ParamsDictionary, RequestBody, ResponseBody>,
): ControllerCallback<ParamsDictionary, RequestBody, ResponseBody> => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}
