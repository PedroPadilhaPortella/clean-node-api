import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo.helper"
import env from "@/main/config/env"
import { SURVEY } from "@/utils/constants"
import { Collection } from "mongodb"
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
  
  it('should load surveys from repository', async () => {
    const sut = makeSut()
    await sut.add(SURVEY)
    const surveys = await sut.loadAll()
    expect(surveys.length).toBe(1)
  })
  
  it('should return no surveys cause no surveys have been added', async () => {
    const sut = makeSut()
    const surveys = await sut.loadAll()
    expect(surveys.length).toBe(0)
  })
})