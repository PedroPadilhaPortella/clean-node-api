import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo.helper'
import app from '../config/app'
import env from '../config/env'
import { hash } from 'bcrypt'

const user = {
  name: 'pedro',
  email: 'pedro@gmail.com',
  password: 'pedro123',
  passwordConfirmation: 'pedro123'
}

describe('Authentication Routes', () => {
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

  describe('POST / SignUp', () => {
    test('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send(user)
        .expect(200)
    })
  })

  describe('POST / Login', () => {
    test('should return 200 on login', async () => {
      const password = await hash(user.password, env.salt)
      await accountCollection.insertOne({ 
        name: user.name, 
        email: user.email, 
        password 
      })

      await request(app)
        .post('/api/login')
        .send({ email: user.email, password: user.password })
        .expect(200)
    })

    test('should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({ email: user.email, password: user.password })
        .expect(401)
    })
  })
})