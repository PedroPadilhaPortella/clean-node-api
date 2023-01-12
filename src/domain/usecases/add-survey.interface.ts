import { SurveyAnswer } from "@/domain/models/survey.model"

export type AddSurveyModel = {
  question: string
  answers: SurveyAnswer[]
  date: Date
}

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}