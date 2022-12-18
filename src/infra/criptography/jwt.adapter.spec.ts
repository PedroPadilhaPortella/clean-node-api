import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt.adapter'

describe('JwtAdapter', () => {
  it('should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('1')
    expect(signSpy).toHaveBeenCalledWith({ id: '1' }, 'secret')
  })
})