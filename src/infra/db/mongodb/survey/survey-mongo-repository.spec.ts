import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo.helper"
import env from "@/main/config/env"
import { ADD_SURVEY, SAVE_SURVEY_RESULT, SIGNUP } from "@/utils/tests"
import { Collection, ObjectId } from "mongodb"
import { SurveyMongoRepository } from "./survey-mongo-repository"

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

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

describe('Survey Mongo Repository', () => {

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
    it('should save the survey on add success', async () => {
      const sut = makeSut()
      await sut.add(ADD_SURVEY)
      const surveyDb = await surveyCollection.findOne({ question: ADD_SURVEY.question })
      expect(surveyDb).toBeTruthy()
      expect(surveyDb._id).toBeTruthy()
    })
  })

  describe('LoadAll', () => {
    it('should load surveys from repository', async () => {
      const sut = makeSut()
      const accountId = await insertAccount()
      const surveyId = await insertSurvey()
      await insertSurveyResult(accountId, surveyId)
      
      const surveys = await sut.loadAll(accountId.toString())

      expect(surveys.length).toEqual(1)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].didAnswer).toBe(true)
    })

    it('should return no surveys cause no surveys have been added', async () => {
      const sut = makeSut()
      const accountId = await insertAccount()
      const surveys = await sut.loadAll(accountId.toString())
      expect(surveys.length).toEqual(0)
    })
  })

  describe('LoadById', () => {
    it('should load survey by id from repository', async () => {
      const surveyDb = await surveyCollection.insertOne(ADD_SURVEY)
      const sut = makeSut()
      const survey = await sut.loadById(surveyDb.insertedId.toString())
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })

  describe('CheckById', () => {
    it('should return true if survey exists', async () => {
      const surveyDb = await surveyCollection.insertOne(ADD_SURVEY)
      const sut = makeSut()
      const result = await sut.checkById(surveyDb.insertedId.toString())
      expect(result).toBeTruthy()
    })

    it('should check survey by id from repository', async () => {
      const surveyDb = await surveyCollection.insertOne(ADD_SURVEY)
      await surveyCollection.deleteMany({})
      const sut = makeSut()
      const result = await sut.checkById(surveyDb.insertedId.toString())
      expect(result).toBeFalsy()
    })
  })
})