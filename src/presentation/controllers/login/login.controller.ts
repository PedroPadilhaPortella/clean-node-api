import { Authentication, Controller, HttpResponse, Validation, BadRequest, Ok, ServerError, Unauthorized } from './login.protocols'

export class LoginController implements Controller {

  constructor (
    private readonly authentication: Authentication, 
    private readonly validation: Validation
  ) { }

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {      
      const error = this.validation.validate(request)
      if (error) {
        return BadRequest(error)
      }
      
      const authentication = await this.authentication.authenticate(request)
      if (!authentication) {
        return Unauthorized()
      }

      return Ok(authentication)

    } catch (error) {
      return ServerError(error)
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}