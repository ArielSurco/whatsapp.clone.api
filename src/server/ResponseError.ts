export class ResponseError extends Error {
  constructor(
    readonly statusCode: number,
    readonly message: string,
    readonly issues?: Record<string, string[] | undefined>,
  ) {
    super(message)
  }
}
