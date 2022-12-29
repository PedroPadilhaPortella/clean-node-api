import { Collection } from "mongodb"
import env from "../../../../main/config/env"
import { MongoHelper } from "../helpers/mongo.helper"
import { AddSurveyModel } from './../../../../domain/usecases/add-survey.interface'
import { SurveyMongoRepository } from "./survey-mongo-repository"

const survey: AddSurveyModel = {
  question: 'question?', 
  answers: [
    { answer: 'answer1', image: 'image1' },
    { answer: 'answer2', image: 'image2' },
    { answer: 'answer3', image: 'image3' }
  ]
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrlTest)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  it('should save the survey on add success', async () => {
    const sut = makeSut()
    await sut.add(survey)
    const surveyDb = await surveyCollection.findOne({ question: survey.question })
    expect(surveyDb).toBeTruthy()
  })
})