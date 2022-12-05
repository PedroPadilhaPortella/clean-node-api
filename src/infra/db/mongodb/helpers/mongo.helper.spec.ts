import env from '../../../../main/config/env'
import { MongoHelper as sut } from './mongo.helper'

describe('MongoHelper', () => { 

  beforeAll(async () => {
    await sut.connect(env.mongoUrlTest)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  it('should reconnect if mongodb get down', async () => {
    let accountCollection = sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})