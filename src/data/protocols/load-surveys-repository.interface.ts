import { SurveyModel } from "@/domain/models/survey.model"

export interface LoadSurveysRepository {
  loadAll: (accountId: string) => Promise<SurveyModel[]>
}