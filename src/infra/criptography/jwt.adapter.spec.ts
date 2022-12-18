import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt.adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('token'))
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JwtAdapter', () => {

  it('should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('1')
    expect(signSpy).toHaveBeenCalledWith({ id: '1' }, 'secret')
  })

  it('should return a token on sign success', async () => {
    const sut = makeSut()
    const token = await sut.encrypt('1')
    expect(token).toEqual('token')
  })
})