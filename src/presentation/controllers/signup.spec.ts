import { MissingParamError } from '../errors/missing-param-error'
import { SignUpController } from './signup'

const createSignUpController = (): SignUpController => {
  return new SignUpController()
}

describe('SignUp Controller', () => {

  it('should return 200 when all fields are provided', () => {
    const sut = createSignUpController()
    const httpRequest = {
      body: {
        name: 'user',
        email: 'email@mail.com',
        password: 'user123',
        passwordConfirmation: 'user123'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({})
  })

  it('should return 400 if no name is provided', () => {
    const sut = createSignUpController()
    const httpRequest = {
      body: {
        email: 'email@mail.com',
        password: 'user123',
        passwordConfirmation: 'user123'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('should return 400 if no email is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'user',
        password: 'user123',
        passwordConfirmation: 'user123'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', () => {
    const sut = createSignUpController()
    const httpRequest = {
      body: {
        name: 'user',
        email: 'email@mail.com',
        passwordConfirmation: 'user123'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should return 400 if no passwordConfirmation is provided', () => {
    const sut = createSignUpController()
    const httpRequest = {
      body: {
        name: 'user',
        email: 'email@mail.com',
        password: 'user123'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
})