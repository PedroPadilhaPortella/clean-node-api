import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt.adapter'

const salt = 12
const password = 'pass'
const hashedPassword = 'hashed_pass'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve(hashedPassword))
  }
}))

const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(salt)
}

describe('BCryptAdapter', () => {

  it('should call bCrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash(password)
    expect(hashSpy).toHaveBeenCalledWith(password, salt)
  })
  
  it('should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.hash(password)
    expect(hash).toBe(hashedPassword)
  })
})