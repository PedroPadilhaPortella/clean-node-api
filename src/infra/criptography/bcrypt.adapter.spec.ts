import bcrypt from 'bcrypt'
import env from '../../main/config/env'
import { BCryptAdapter } from './bcrypt.adapter'

const password = 'pass'
const hashedPassword = 'hashed_pass'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve(hashedPassword))
  },
  async compare (a: string, b: string): Promise<boolean> {
    return await new Promise(resolve => resolve(a === b))
  }
}))

const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(env.salt)
}

describe('BCryptAdapter', () => {

  describe('hash method', () => {
    it('should call hash with correct values', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash(password)
      expect(hashSpy).toHaveBeenCalledWith(password, env.salt)
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
    
    it('should return true when compare success', async () => {
      const sut = makeSut()
      const compare = await sut.compare(password, password)
      expect(compare).toBeTruthy()
    })
    
    it('should return false when compare fails', async () => {
      const sut = makeSut()
      const compare = await sut.compare(password, hashedPassword)
      expect(compare).toBeFalsy()
    })
  })
})