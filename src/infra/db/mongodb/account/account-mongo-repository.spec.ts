import { Collection } from "mongodb"
import env from "../../../../main/config/env"
import { MongoHelper } from "../helpers/mongo.helper"
import { CollectionsEnum } from './../../../../domain/enums/collections.enum'
import { AccountMongoRepository } from "./account-mongo-repository"

const account = { name: 'pedro', email: 'email@mail.com', password: 'pass123' }

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
    accountCollection = MongoHelper.getCollection(CollectionsEnum.ACCOUNTS)
    await accountCollection.deleteMany({})
  })

  it('should return an account on add success', async () => {
    const sut = makeSut()
    const accountDb = await sut.add(account)

    expect(accountDb).toBeTruthy()
    expect(accountDb.id).toBeTruthy()
    expect(accountDb.name).toBe('pedro')
    expect(accountDb.email).toBe('email@mail.com')
    expect(accountDb.password).toBe('pass123')
  })

  it('should return an account on loadByEmail success', async () => {
    const sut = makeSut()

    await accountCollection.insertOne(account)
    const accountDb = await sut.loadByEmail(account.email)

    expect(accountDb).toBeTruthy()
    expect(accountDb?.id).toBeTruthy()
    expect(accountDb?.name).toBe('pedro')
    expect(accountDb?.email).toBe('email@mail.com')
    expect(accountDb?.password).toBe('pass123')
  })

  it('should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const accountDb = await sut.loadByEmail(account.email)
    expect(accountDb).toBeNull()
  })
  
  it('should update the accountAccessToken on updateAccessToken success', async () => {
    const sut = makeSut()

    const result = await accountCollection.insertOne(account)
    await sut.updateToken(result.insertedId, 'token')

    const accountDb = await accountCollection.findOne({ _id: result.insertedId })

    expect(accountDb).toBeTruthy()
    expect(accountDb?.accessToken).toEqual('token')
  })
})