import { Authentication, Controller, HttpRequest, HttpResponse, Validation, BadRequest, Ok, ServerError, Unauthorized } from './login.protocols'

export class LoginController implements Controller {

  constructor (
    private readonly authentication: Authentication, 
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return BadRequest(error)
      }

      const token = await this.authentication.authenticate({ email, password })
      if (!token) {
        return Unauthorized()
      }

      return Ok({ accessToken: token })

    } catch (error) {
      return ServerError(error)
    }
  }
}