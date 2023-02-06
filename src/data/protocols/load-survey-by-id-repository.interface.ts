import { SurveyModel } from '@/domain/models/survey.model'

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<LoadSurveyByIdRepository.Result>
}

export namespace LoadSurveyByIdRepository {
  export type Result = SurveyModel
}