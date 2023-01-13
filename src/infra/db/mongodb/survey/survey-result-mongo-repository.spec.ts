import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result.interface'
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo.helper"
import env from "@/main/config/env"
import { ADD_SURVEY, SAVE_SURVEY_RESULT, SIGNUP } from '@/utils/constants'
import { Collection } from "mongodb"
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('Survey Result Mongo Repository', () => {
  let accountCollection: Collection
  let surveyCollection: Collection
  let surveyResultCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrlTest)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection(CollectionsEnum.ACCOUNTS)
    surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEYS)
    surveyResultCollection = MongoHelper.getCollection(CollectionsEnum.SURVEY_RESULTS)

    await accountCollection.deleteMany({})
    await surveyCollection.deleteMany({})
    await surveyResultCollection.deleteMany({})
  })

  describe('Save', () => {
    it('should add a surveyResult on success', async () => {
      const account = await accountCollection.insertOne(SIGNUP)
      const survey = await surveyCollection.insertOne(ADD_SURVEY)
      const sut = makeSut() 
      const addSurveyResult: SaveSurveyResultModel = { ...SAVE_SURVEY_RESULT, accountId: account.insertedId.toString(), surveyId: survey.insertedId.toString() }
      const surveyResult = await sut.save(addSurveyResult)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
    })
  })
})