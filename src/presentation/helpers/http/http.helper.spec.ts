import { InternalServerError, MissingParamError } from '../../errors'
import { UnauthorizedError } from '../../errors/unauthorized-error'
import { Ok, BadRequest, ServerError, Unauthorized } from './http.helper'

describe('HttpHelper', () => {

  it('Ok should return statusCode 200 and a body', () => {
    expect(Ok({}))
      .toEqual({ statusCode: 200, body: {} })
  })

  it('BadRequest should return statusCode 400 and an error', () => {
    expect(BadRequest(new MissingParamError('name')))
      .toEqual({ statusCode: 400, body: new MissingParamError('name') })
  })

  it('ServerError should return statusCode 500 and an error', () => {
    const error = new Error('Mensagem de erro')
    expect(ServerError(error))
      .toEqual({ statusCode: 500, body: new InternalServerError(error.stack ?? 'Unknown Error') })
  })

  it('Unauthorized should return statusCode 401 and an error', () => {
    expect(Unauthorized())
      .toEqual({ statusCode: 401, body: new UnauthorizedError() })
  })
})