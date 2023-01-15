import { DbLoadSurveyById } from "@/data/usecases/load-survey-by-id/db-load-survey-by-id"
import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id.interface"
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const createDbLoadSurveyByIdFactory = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}