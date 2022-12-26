import { EmailAlreadyTaken } from './../../errors/email-already-taken-error'
import { Forbidden } from './../../helpers/http/http.helper'
import { AddAccount, Authentication, BadRequest, Controller, HttpRequest, HttpResponse, Ok, ServerError, Unauthorized, Validation } from './signup.protocols'

export class SignUpController implements Controller {
  
  constructor (
    private readonly addAccount: AddAccount, 
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = httpRequest.body

      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return BadRequest(error)
      }

      const account = await this.addAccount.add({ name, email, password })
      if (!account) {
        return Forbidden(new EmailAlreadyTaken())
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