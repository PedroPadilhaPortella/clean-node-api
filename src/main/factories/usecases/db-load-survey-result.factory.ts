import { DbLoadSurveyResult } from '@/data/usecases/load-survey-result/db-load-survey-result'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey/survey-result-mongo-repository'

export const createDbLoadSurveyResultFactory = (): DbLoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyResult(surveyResultMongoRepository, surveyMongoRepository)
}