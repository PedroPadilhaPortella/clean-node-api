import { Forbidden, Ok } from './../helpers/http/http.helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from './../protocols'
import { AccessDeniedError } from '../errors'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token.interface'

export class AuthMiddleware implements Middleware {

  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}
  
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']

    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken)

      if (account) {
        return Ok({ accountId: account.id })
      }
    }

    return Forbidden(new AccessDeniedError())
  }
}