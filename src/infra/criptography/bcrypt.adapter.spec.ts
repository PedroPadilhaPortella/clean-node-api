import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt.adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_pass'))
  }
}))

describe('BCryptAdapter', () => {

  it('should call bCrypt with correct values', async () => {
    const salt = 12
    const password = 'pass'
    const sut = new BCryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt(password)
    expect(hashSpy).toHaveBeenCalledWith(password, salt)
  })

  it('should return a hash on success', async () => {
    const salt = 12
    const password = 'pass'
    const sut = new BCryptAdapter(salt)
    const hash = await sut.encrypt(password)
    expect(hash).toBe('hashed_pass')
  })
})