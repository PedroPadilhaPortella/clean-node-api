import { AddSurveyParams } from "@/domain/usecases/add-survey.interface"

export interface AddSurveyRepository {
  add: (survey: AddSurveyParams) => Promise<void>
}