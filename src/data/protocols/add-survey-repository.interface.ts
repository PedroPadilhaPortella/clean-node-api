import { AddSurvey } from "../usecases/add-survey/db-add-survey.protocols"

export interface AddSurveyRepository {
  add: (survey: AddSurveyRepository.Params) => Promise<void>
}

export namespace AddSurveyRepository {
  export type Params = AddSurvey.Params
}