import { AddAccount, Authentication, BadRequest, Controller, EmailAlreadyTaken, Forbidden, HttpResponse, Ok, ServerError, Unauthorized, Validation } from './signup.protocols'

export class SignUpController implements Controller {
  
  constructor (
    private readonly addAccount: AddAccount, 
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return BadRequest(error)
      }
      
      const { name, email, password } = request
      const account = await this.addAccount.add({ name, email, password })
      if (!account) {
        return Forbidden(new EmailAlreadyTaken())
      } 

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

export namespace SignUpController {
  export type Request = {
    email: string
    name: string
    password: string
    passwordConfirmation: string
  }
}