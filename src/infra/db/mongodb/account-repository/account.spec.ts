import { Collection } from "mongodb"
import env from "../../../../main/config/env"
import { MongoHelper } from "../helpers/mongo.helper"
import { AccountMongoRepository } from "./account"

const account = { name: 'user', email: 'email@mail.com', password: 'pass123' }

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrlTest)
  })
  
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  it('should return an account on add success', async () => {
    const sut = makeSut()
    const accountDb = await sut.add(account)

    expect(accountDb).toBeTruthy()
    expect(accountDb.id).toBeTruthy()
    expect(accountDb.name).toBe('user')
    expect(accountDb.email).toBe('email@mail.com')
    expect(accountDb.password).toBe('pass123')
  })

  it('should return an account on loadByEmail success', async () => {
    const sut = makeSut()

    await accountCollection.insertOne(account)
    const accountDb = await sut.loadByEmail(account.email)

    expect(accountDb).toBeTruthy()
    expect(accountDb?.id).toBeTruthy()
    expect(accountDb?.name).toBe('user')
    expect(accountDb?.email).toBe('email@mail.com')
    expect(accountDb?.password).toBe('pass123')
  })

  it('should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const accountDb = await sut.loadByEmail(account.email)
    expect(accountDb).toBeNull()
  })
})