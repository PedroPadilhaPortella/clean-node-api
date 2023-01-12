import { AddSurveyModel } from "@/domain/usecases/add-survey.interface"

export interface AddSurveyRepository {
  add: (survey: AddSurveyModel) => Promise<void>
}