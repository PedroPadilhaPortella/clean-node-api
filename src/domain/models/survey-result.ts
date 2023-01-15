import { ObjectId } from "mongodb"

export type SurveyResultModel = {
  id: ObjectId | string
  surveyId: ObjectId | string 
  accountId: ObjectId | string
  answer: string
  date: Date
}