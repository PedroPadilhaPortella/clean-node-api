import { DbSaveSurveyResult } from "@/data/usecases/save-survey-result/db-save-survey-result"
import { SaveSurveyResult } from "@/domain/usecases/save-survey-result.interface"
import { SurveyResultMongoRepository } from "@/infra/db/mongodb/survey/survey-result-mongo-repository"

export const createDbSaveSurveyResultFactory = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository, surveyResultMongoRepository)
}