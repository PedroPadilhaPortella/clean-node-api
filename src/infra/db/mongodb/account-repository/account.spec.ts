import { MongoHelper } from "../helpers/mongo.helper"
import { AccountMongoRepository } from "./account"

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect()
  })
  
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should return an account on success', async () => {
    const sut = makeSut()
    const account = { name: 'user', email: 'email@mail.com', password: 'pass123' }
    const accountDb = await sut.add(account)

    expect(accountDb).toBeTruthy()
    expect(accountDb.id).toBeTruthy()
    expect(accountDb.name).toBe('user')
    expect(accountDb.email).toBe('email@mail.com')
    expect(accountDb.password).toBe('pass123')
  })
})