import { InternalServerError } from "../errors"
import { HttpResponse } from "../protocols/http.interface"

export const Ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const BadRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const ServerError = (): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError()
})
