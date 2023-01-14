import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo.helper"
import env from "@/main/config/env"
import { ADD_SURVEY } from "@/utils/constants"
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
      await sut.add(ADD_SURVEY)
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(1)
      expect(surveys[0].id).toBeTruthy()
    })

    it('should return no surveys cause no surveys have been added', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
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
})