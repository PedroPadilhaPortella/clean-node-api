import { LoadAccountByToken } from './../../../domain/usecases/load-account-by-token.interface'
import { DbLoadAcccountByToken } from './db-load-account-by-token'
import { Decrypter } from './../../protocols/decrypter.interface'

const createDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return 'decrypted_token'
    }
  }
  return new DecrypterStub()
}

interface SutTypes {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
  const decrypterStub = createDecrypterStub()
  const sut = new DbLoadAcccountByToken(decrypterStub)
  return { sut, decrypterStub }
}

describe('DbLoadAccountByToken', () => {

  it('should call decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('token')
    expect(decrypterSpy).toHaveBeenCalledWith('token')
  })
})