import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo.helper'
import { SIGNUP } from '@/utils'
import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'

describe('Authentication Routes', () => {
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

  describe('POST / SignUp', () => {
    test('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send(SIGNUP)
        .expect(200)
    })
  })

  describe('POST / Login', () => {
    test('should return 200 on login', async () => {
      const password = await hash(SIGNUP.password, env.salt)
      await accountCollection.insertOne({ 
        name: SIGNUP.name, 
        email: SIGNUP.email, 
        password 
      })

      await request(app)
        .post('/api/login')
        .send({ email: SIGNUP.email, password: SIGNUP.password })
        .expect(200)
    })

    test('should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({ email: SIGNUP.email, password: SIGNUP.password })
        .expect(401)
    })
  })
})