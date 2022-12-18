import { AddAccount, Controller, HttpRequest, HttpResponse, Validation, BadRequest, Ok, ServerError } from './signup.protocols'

export class SignUpController implements Controller {
  
  constructor (
    private readonly addAccount: AddAccount, 
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = httpRequest.body

      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return BadRequest(error)
      }

      const account = await this.addAccount.add({ name, email, password })
      return Ok(account)

    } catch (error) {
      return ServerError(error)
    }
  }
}