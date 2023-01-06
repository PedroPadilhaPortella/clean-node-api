import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt.adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('token'))
  },
  async verify (): Promise<string> {
    return await new Promise(resolve => resolve('value'))
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JwtAdapter', () => {

  describe('encrypt method', () => {
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

    it('should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.encrypt('1')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('decrypt method', () => {
    it('should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('token')
      expect(verifySpy).toHaveBeenCalledWith('token', 'secret')
    })

    it('should return a value on verify success', async () => {
      const sut = makeSut()
      const result = await sut.decrypt('token')
      expect(result).toEqual('value')
    })

    it('should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.decrypt('token')
      await expect(promise).rejects.toThrow()
    })
  })
})