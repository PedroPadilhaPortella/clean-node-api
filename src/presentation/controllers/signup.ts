import { MissingParamError, InvalidParamError } from '../errors'
import { BadRequest, ServerError } from '../helpers/http.helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

export class SignUpController implements Controller {

  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamError(field))
        }
      }

      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isEmailValid) {
        return BadRequest(new InvalidParamError('email'))
      }

      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
        return BadRequest(new InvalidParamError('passwordConfirmation'))
      }

      return { statusCode: 200, body: {} }

    } catch (error) {
      return ServerError()
    }
  }
}