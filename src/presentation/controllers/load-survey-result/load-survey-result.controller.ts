import { Controller, Forbidden, HttpResponse, InvalidParamError, LoadSurveyById, ServerError, LoadSurveyResult, Ok } from './load-survey-result.protocols'

export class LoadSurveyResultController implements Controller {

  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) { }

  async handle (request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId } = request

      const survey = await this.loadSurveyById.loadById(surveyId)

      if (!survey) {
        return Forbidden(new InvalidParamError('surveyId'))
      }

      const surveyResult = await this.loadSurveyResult.loadBySurveyId(surveyId, accountId)
      return Ok(surveyResult)

    } catch (error) {
      return ServerError(error)
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
  }
}