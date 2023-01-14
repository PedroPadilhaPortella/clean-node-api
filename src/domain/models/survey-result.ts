import { ObjectId } from "mongodb"

export type SurveyResultModel = {
  id: ObjectId | string
  surveyId: string
  accountId: string
  answer: string
  date: Date
}