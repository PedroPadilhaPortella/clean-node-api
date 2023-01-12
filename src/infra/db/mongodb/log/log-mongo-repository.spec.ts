import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo.helper"
import env from "@/main/config/env"
import { Collection } from 'mongodb'
import { LogMongoRepository } from "./log-mongo-repository"

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('LogMongoRepository', () => { 
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrlTest)
  })
  
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection(CollectionsEnum.ERRORS)
    await errorCollection.deleteMany({})
  })

  it('should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('An test exception occured')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})