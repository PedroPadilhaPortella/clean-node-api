import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt.adapter'

const salt = 12
const password = 'pass'
const hashedPassword = 'hashed_pass'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve(hashedPassword))
  },
  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(salt)
}

describe('BCryptAdapter', () => {

  describe('hash method', () => {
    it('should call hash with correct values', async () => {
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

  describe('compare method', () => {
    it('should call compare with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare(password, hashedPassword)
      expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword)
    })
    
    it('should return a boolean on success', async () => {
      const sut = makeSut()
      const compare = await sut.compare(password, hashedPassword)
      expect(compare).toBeTruthy()
    })
  })
})