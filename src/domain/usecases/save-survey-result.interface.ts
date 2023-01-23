import { ObjectId } from 'mongodb'
import { SurveyResultModel } from "@/domain/models/survey-result"

export type SaveSurveyResultParams = {
  surveyId: ObjectId | string 
  accountId: ObjectId | string
  answer: string
  date: Date
}

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel>
}