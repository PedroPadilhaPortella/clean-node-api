import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { SaveSurveyResultParams } from '@/domain/usecases/save-survey-result.interface'
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo.helper"
import env from "@/main/config/env"
import { ADD_SURVEY, SAVE_SURVEY_RESULT, SIGNUP } from '@/utils'
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
      const surveyResult = await sut.save(addSurveyResult)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
    })

    it('should update a surveyResult on success when its not a new surveyResult', async () => {
      const sut = makeSut()
      const addSurveyResult = await createAccountAndSurvey()
      
      let surveyResult = await sut.save({ ...addSurveyResult, answer: 'answer1' })
      expect(surveyResult.answer).toEqual('answer1')
      surveyResult = await sut.save({ ...addSurveyResult, answer: 'answer2' })
      expect(surveyResult.answer).toEqual('answer2')
    })
  })
})