import { InvalidParamError, MissingParamError } from '../../errors'
import { BadRequest, Ok, ServerError } from '../../helpers/http.helper'
import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse } from './signup.protocols'

export class SignUpController implements Controller {

  private readonly addAccount: AddAccount
  private readonly emailValidator: EmailValidator

  constructor (addAccount: AddAccount, emailValidator: EmailValidator) {
    this.addAccount = addAccount
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password, passwordConfirmation } = httpRequest.body

      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamError(field))
        }
      }

      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return BadRequest(new InvalidParamError('email'))
      }

      if (password !== passwordConfirmation) {
        return BadRequest(new InvalidParamError('passwordConfirmation'))
      }

      const account = await this.addAccount.add({ name, email, password })

      return Ok(account)

    } catch (error) {
      return ServerError()
    }
  }
}