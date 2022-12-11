import { MissingParamError } from '../../errors'
import { BadRequest, Ok } from '../../helpers/http.helper'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const sut = new LoginController()
  return { sut }
}

describe('Login Controller', () => {

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = { body: { password: 'pass123' } }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = { body: { email: 'pedro@gmail.com' } }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('password')))
  })

  it('should return 200 when all fields are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = { body: { email: 'pedro@gmail.com', password: 'senha123' } }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(Ok({ email: 'pedro@gmail.com', password: 'senha123' }))
  })
})