import { AddAccount, Controller, HttpRequest, HttpResponse, Validation, BadRequest, Ok, ServerError, Authentication, Unauthorized } from './signup.protocols'

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

      await this.addAccount.add({ name, email, password })
      
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