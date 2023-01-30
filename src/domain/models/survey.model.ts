import { ObjectId } from "mongodb"

export type SurveyModel = {
  id: ObjectId | string
  question: string
  answers: SurveyAnswer[]
  date: Date
  didAnswer?: boolean
}

export type SurveyAnswer = {
  answer: string
  image?: string
}
