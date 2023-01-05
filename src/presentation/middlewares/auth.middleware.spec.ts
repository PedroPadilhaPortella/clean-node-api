import { AccessDeniedError } from '../errors'
import { Forbidden } from './../helpers/http/http.helper'
import { AuthMiddleware } from './auth.middleware'

describe('Auth Middleware', () => {

  it('should return 403 if no x-access-token exists in headers', async () => {
    const sut = new AuthMiddleware()
    const response = await sut.handle({})
    expect(response).toEqual(Forbidden(new AccessDeniedError()))
  })
})