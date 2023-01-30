import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo.helper"
import env from "@/main/config/env"
import { ADD_SURVEY, SAVE_SURVEY_RESULT, SIGNUP } from '@/utils/tests'
import { Collection, ObjectId } from "mongodb"
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const insertAccount = async (): Promise<ObjectId> => {
  const account = await accountCollection.insertOne(SIGNUP)
  return account.insertedId
}

const insertSurvey = async (): Promise<ObjectId> => {
  const survey = await surveyCollection.insertOne(ADD_SURVEY)
  return survey.insertedId
}
const insertSurveyResult = async (accountId: ObjectId, surveyId: ObjectId): Promise<ObjectId> => {
  const surveyResult = await surveyResultCollection
    .insertOne({ ...SAVE_SURVEY_RESULT, accountId, surveyId })
  return surveyResult.insertedId
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
    surveyResultCollection = MongoHelper.getCollection(CollectionsEnum.SURVEY_RESULT)

    await accountCollection.deleteMany({})
    await surveyCollection.deleteMany({})
    await surveyResultCollection.deleteMany({})
  })

  describe('Save', () => {
    it('should add a surveyResult on success when its a new surveyResult', async () => {
      const sut = makeSut()       
      const accountId = await insertAccount()
      const surveyId = await insertSurvey()

      const data = {
        ...SAVE_SURVEY_RESULT, 
        accountId: accountId.toString(), 
        surveyId: surveyId.toString(), 
        answer: 'answer1' 
      }

      await sut.save(data)
      
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId)
      })

      expect(surveyResult).toBeTruthy()
    })

    it('should update a surveyResult on success when its not a new surveyResult', async () => {
      const sut = makeSut()
      const accountId = await insertAccount()
      const surveyId = await insertSurvey()

      const data = { 
        ...SAVE_SURVEY_RESULT, 
        accountId: accountId.toString(), 
        surveyId: surveyId.toString()
      }

      await sut.save({ ...data, answer: 'answer1' })
      await sut.save({ ...data, answer: 'answer2' })
      
      const results = await surveyResultCollection.find({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId)
      }).toArray()
      
      expect(results).toHaveLength(1)
    })
  })

  describe('LoadBySurveyId', () => {
    it('should load a survey result', async () => {
      const sut = makeSut()
      const accountId = await insertAccount()
      const surveyId = await insertSurvey()
      await insertSurveyResult(accountId, surveyId)
      
      const result = await sut.loadBySurveyId(surveyId.toString(), accountId.toString())
      
      expect(result.surveyId).toEqual(surveyId)
      expect(result.answers[0].count).toEqual(1)
      expect(result.answers[0].percent).toEqual(100)
      expect(result.answers[1].count).toEqual(0)
      expect(result.answers[1].percent).toEqual(0)
      expect(result.answers[2].count).toEqual(0)
      expect(result.answers[2].percent).toEqual(0)
    })

    it('should return null if there is no survey', async () => {
      const sut = makeSut()      
      const accountId = await insertAccount()
      const surveyId = await insertSurvey()
      const result = await sut.loadBySurveyId(surveyId.toString(), accountId.toString())
      expect(result).toBeNull() 
    })
  })
})