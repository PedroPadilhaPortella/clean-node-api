import { SurveyResultModel } from "../models/survey-result"

export interface LoadSurveyResult {
  loadBySurveyId: (surveyId: string, accountId: string) => Promise<LoadSurveyResult.Result>
}

export namespace LoadSurveyResult {
  export type Result = SurveyResultModel
}