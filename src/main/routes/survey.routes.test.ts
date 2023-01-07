import jwt from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo.helper'
import app from '../config/app'
import env from '../config/env'
import { CollectionsEnum } from './../../domain/enums/collections.enum'
import { AddSurveyModel } from './../../domain/usecases/add-survey.interface'

const survey: AddSurveyModel = {
  question: 'question?', 
  answers: [
    { answer: 'answer1', image: 'image1' },
    { answer: 'answer2', image: 'image2' },
    { answer: 'answer3', image: 'image3' }
  ]
}

const account = { name: 'pedro', email: 'email@mail.com', password: 'pass123', role: 'admin' }

describe('Survey Routes', () => {
  let surveyCollection: Collection
  let accountCollection: Collection

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
        .send(survey)
        .expect(403)
    })

    test('should return 204 on add survey with valid token', async () => {
      const result = await accountCollection.insertOne(account)
      const token = jwt.sign({ id: result.insertedId.toString() }, env.jwtSecret)
      await accountCollection.updateOne(
        { _id: result.insertedId }, { 
          $set: { 
            accessToken: token 
          } 
        }
      )

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', token)
        .send(survey)
        .expect(204)
    })
  })
})