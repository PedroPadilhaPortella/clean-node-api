import { DbAddAccount } from "./db-add-account"

class EncrypterStub {
  async encrypt (value: string): Promise<string> {
    return await new Promise(resolve => resolve('hashed_password'))
  }
}

describe('DbAddAccount', () => {
  it('should call encripter with correct password', async () => {
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = { name: 'name', email: 'email@mail.com', password: 'pass123' }

    await sut.add(account)
    expect(encryptSpy).toHaveBeenCalledWith('pass123')
  })
})