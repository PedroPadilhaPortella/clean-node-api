import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt.adapter'

describe('BCryptAdapter', () => {

  it('should call bCrypt with correct values', async () => {
    const salt = 12
    const password = 'pass'
    const sut = new BCryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt(password)
    expect(hashSpy).toHaveBeenCalledWith(password, salt)
  })
})