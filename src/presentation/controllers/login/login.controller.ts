import { Authentication, Controller, HttpRequest, HttpResponse, Validation, BadRequest, Ok, ServerError, Unauthorized } from './login.protocols'

export class LoginController implements Controller {

  constructor (
    private readonly authentication: Authentication, 
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {      
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return BadRequest(error)
      }
      
      const { email, password } = httpRequest.body
      const authentication = await this.authentication.authenticate({ email, password })
      if (!authentication) {
        return Unauthorized()
      }

      return Ok(authentication)

    } catch (error) {
      return ServerError(error)
    }
  }
}