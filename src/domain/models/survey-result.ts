import { ObjectId } from "mongodb"

export type SurveyResultModel = {
  surveyId: ObjectId | string 
  question: string
  answers: SurveyResultAnswer[]
  date: Date
}

export type SurveyResultAnswer = {
  answer: string
  image?: string
  count: number
  percent: number
  isCurrentAccountAnswer: boolean
}
