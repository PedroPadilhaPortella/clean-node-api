import { SurveyModel } from "@/domain/models/survey.model"

export interface LoadSurveyById {
  loadById: (id: string) => Promise<LoadSurveyById.Result>
}

export namespace LoadSurveyById {
  export type Result = SurveyModel
}