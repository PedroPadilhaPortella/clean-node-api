import { InternalServerError, UnauthorizedError } from "@/presentation/errors"
import { HttpResponse } from "@/presentation/protocols"

export const Ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const NoContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
})

export const BadRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const Unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const Forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const ServerError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError(error.stack ?? 'Unknown Error')
})
