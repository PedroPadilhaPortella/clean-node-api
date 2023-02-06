import { DbCheckSurveyById } from "@/data/usecases/check-survey-by-id/db-check-survey-by-id"
import { CheckSurveyById } from "@/domain/usecases/check-survey-by-id.interface"
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const createDbCheckSurveyByIdFactory = (): CheckSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbCheckSurveyById(surveyMongoRepository)
}