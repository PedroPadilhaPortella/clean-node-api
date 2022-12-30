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

describe('Survey Routes', () => {
  let surveyCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrlTest)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEYS)
    await surveyCollection.deleteMany({})
  })

  describe('POST / Surveys', () => {
    test('should return 204 on add survey success', async () => {
      await request(app)
        .post('/api/surveys')
        .send(survey)
        .expect(204)
    })
  })
})