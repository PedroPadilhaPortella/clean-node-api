import { InternalServerError } from "../errors/internal-server-error"
import { HttpResponse } from "../protocols/http"

export const Created = (body: any): HttpResponse => ({
  statusCode: 200,
  body
})

export const BadRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const ServerError = (): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError()
})
