import { Forbidden } from './../helpers/http/http.helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from './../protocols'
import { AccessDeniedError } from '../errors'

export class AuthMiddleware implements Middleware {
  
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => resolve(Forbidden(new AccessDeniedError())))
  }
}