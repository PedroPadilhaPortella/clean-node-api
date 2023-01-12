import { SurveyModel } from "@/domain/models/survey.model"

export interface LoadSurveyById {
  load: (id: string) => Promise<SurveyModel>
}