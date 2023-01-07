import { AccessDeniedError, Forbidden, HttpRequest, HttpResponse, LoadAccountByToken, Middleware, Ok, ServerError } from "./middlewares.protocols"

export class AuthMiddleware implements Middleware {

  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']

      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) {
          return Ok({ accountId: account.id.toString() })
        }
      }

      return Forbidden(new AccessDeniedError())
    } catch (error) {
      return ServerError(error)
    }
  }
}