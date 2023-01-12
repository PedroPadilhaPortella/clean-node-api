import jwt from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo.helper'
import app from '../config/app'
import env from '../config/env'
import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { ACCOUNT, ADD_SURVEY } from '@/utils/constants'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (result: any): Promise<string> => {
  const token = jwt.sign({ id: result.insertedId.toString() }, env.jwtSecret)
  await accountCollection.updateOne(
    { _id: result.insertedId }, { 
      $set: { 
        accessToken: token 
      } 
    }
  )

  return token
}

describe('Survey Routes', () => {

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrlTest)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEYS)
    accountCollection = MongoHelper.getCollection(CollectionsEnum.ACCOUNTS)
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('POST / Surveys', () => {
    test('should return 403 if not authenticated', async () => {
      await request(app)
        .post('/api/surveys')
        .send(ADD_SURVEY)
        .expect(403)
    })

    test('should return 204 on add survey with valid token', async () => {
      const result = await accountCollection.insertOne({ ...ACCOUNT, role: 'admin' })
      const token = await makeAccessToken(result)

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', token)
        .send(ADD_SURVEY)
        .expect(204)
    })
  })

  describe('GET / Surveys', () => {
    test('should return 403 if not authenticated', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('should return 204 on load surveys with valid token and no surveys enrolled', async () => {
      const result = await accountCollection.insertOne(ACCOUNT)
      const token = await makeAccessToken(result)

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', token)
        .expect(204)
    })

    test('should return 200 on load surveys with valid token', async () => {
      const result = await accountCollection.insertOne(ACCOUNT)
      await surveyCollection.insertOne(ADD_SURVEY)
      const token = await makeAccessToken(result)

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', token)
        .expect(200)
    })
  })
})