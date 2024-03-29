import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo.helper'
import { ADD_SURVEY, SIGNUP } from '@/utils/tests'
import jwt from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const makeAccessToken = async (result: any): Promise<string> => {
  const token = jwt.sign({ id: result.insertedId.toString() }, env.jwtSecret)
  await accountCollection.updateOne(
    { _id: result.insertedId }, { 
      $set: { accessToken: token } 
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
    accountCollection = MongoHelper.getCollection(CollectionsEnum.ACCOUNTS)
    surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEYS)
    surveyResultCollection = MongoHelper.getCollection(CollectionsEnum.SURVEY_RESULT)
    
    await accountCollection.deleteMany({})
    await surveyCollection.deleteMany({})
    await surveyResultCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {

    test('should return 403 if not authenticated', async () => {
      await request(app)
        .put('/api/surveys/12345/results')
        .send({ answer: 'answer1' })
        .expect(403)
    })
  
    test('should return 200 on success', async () => {
      const result = await accountCollection.insertOne(SIGNUP)
      const token = await makeAccessToken(result)
      const surveyId = (await surveyCollection.insertOne(ADD_SURVEY)).insertedId.toString()

      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', token)
        .send({ answer: 'answer1' })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {

    test('should return 403 if not authenticated', async () => {
      await request(app)
        .get('/api/surveys/12345/results')
        .expect(403)
    })

    test('should return 200 on success', async () => {
      const result = await accountCollection.insertOne(SIGNUP)
      const token = await makeAccessToken(result)
      const surveyId = (await surveyCollection.insertOne(ADD_SURVEY)).insertedId.toString()

      await request(app)
        .get(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', token)
        .expect(200)
    })
  })
})