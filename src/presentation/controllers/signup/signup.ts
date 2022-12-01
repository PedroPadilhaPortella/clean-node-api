import { MissingParamError, InvalidParamError } from '../../errors'
import { BadRequest, Created, ServerError } from '../../helpers/http.helper'
import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse } from './signup.protocols'

export class SignUpController implements Controller {

  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
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

      const account = this.addAccount.add({ name, email, password })

      return Created(account)

    } catch (error) {
      return ServerError()
    }
  }
}