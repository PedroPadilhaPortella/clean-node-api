import { Collection } from "mongodb"
import env from "../../../../main/config/env"
import { SURVEY } from "../../../../utils/constants"
import { MongoHelper } from "../helpers/mongo.helper"
import { CollectionsEnum } from './../../../../domain/enums/collections.enum'
import { SurveyMongoRepository } from "./survey-mongo-repository"

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
    surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEYS)
    await surveyCollection.deleteMany({})
  })

  it('should save the survey on add success', async () => {
    const sut = makeSut()
    await sut.add(SURVEY)
    const surveyDb = await surveyCollection.findOne({ question: SURVEY.question })
    expect(surveyDb).toBeTruthy()
  })
})