import { InternalServerError, UnauthorizedError } from "../errors"
import { HttpResponse } from "../protocols/http.interface"

export const Ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const BadRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const ServerError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError(error.stack ?? 'Unknown Error')
})

export const Unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})
