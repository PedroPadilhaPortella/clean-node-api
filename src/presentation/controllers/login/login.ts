import { InvalidParamError, MissingParamError } from '../../errors'
import { BadRequest, Ok, ServerError } from '../../helpers/http.helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from './login.protocols'

export class LoginController implements Controller {

  // private readonly addAccount: AddAccount
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    // this.addAccount = addAccount
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamError(field))
        }
      }

      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return BadRequest(new InvalidParamError('email'))
      }

      // if (password !== passwordConfirmation) {
      //   return BadRequest(new InvalidParamError('passwordConfirmation'))
      // }

      // const account = await this.addAccount.add({ name, email, password })

      return Ok({ email, password })

    } catch (error) {
      return ServerError(error)
    }
  }
}