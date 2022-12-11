import { InvalidParamError, MissingParamError } from '../../errors'
import { BadRequest, Ok, ServerError } from '../../helpers/http.helper'
import { Authentication, Controller, EmailValidator, HttpRequest, HttpResponse } from './login.protocols'

export class LoginController implements Controller {

  private readonly authentication: Authentication
  private readonly emailValidator: EmailValidator

  constructor (authentication: Authentication, emailValidator: EmailValidator) {
    this.authentication = authentication
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

      const token = await this.authentication.authenticate(email, password)
      return Ok(token)

    } catch (error) {
      return ServerError(error)
    }
  }
}