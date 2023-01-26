import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { SaveSurveyResultParams } from '@/domain/usecases/save-survey-result.interface'
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo.helper"
import env from "@/main/config/env"
import { ADD_SURVEY, SAVE_SURVEY_RESULT, SIGNUP } from '@/utils/tests'
import { Collection } from "mongodb"
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const createAccountAndSurvey = async (): Promise<SaveSurveyResultParams> => {
  const account = await accountCollection.insertOne(SIGNUP)
  const survey = await surveyCollection.insertOne(ADD_SURVEY)
  const addSurveyResult: SaveSurveyResultParams = { 
    ...SAVE_SURVEY_RESULT, 
    accountId: account.insertedId, 
    surveyId: survey.insertedId
  }
  return addSurveyResult
}

describe('Survey Result Mongo Repository', () => {

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
    it('should add a surveyResult on success when its a new surveyResult', async () => {
      const sut = makeSut() 
      const addSurveyResult = await createAccountAndSurvey()
      await sut.save(addSurveyResult)
      
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: addSurveyResult.surveyId,
        accountId: addSurveyResult.accountId
      })

      expect(surveyResult).toBeTruthy()
    })

    it('should update a surveyResult on success when its not a new surveyResult', async () => {
      const sut = makeSut()
      const addSurveyResult = await createAccountAndSurvey()
      
      await sut.save({ ...addSurveyResult, answer: 'answer1' })
      await sut.save({ ...addSurveyResult, answer: 'answer2' })
      
      const results = await surveyResultCollection.find({
        surveyId: addSurveyResult.surveyId,
        accountId: addSurveyResult.accountId
      }).toArray()
      
      expect(results).toHaveLength(1)
    })
  })
})