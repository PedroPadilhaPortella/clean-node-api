import { SaveSurveyResultParams } from "@/domain/usecases/save-survey-result.interface"

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultParams) => Promise<void>
}