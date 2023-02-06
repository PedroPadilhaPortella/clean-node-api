import { Controller, Forbidden, HttpResponse, InvalidParamError, ServerError, LoadSurveyResult, Ok, CheckSurveyById } from './load-survey-result.protocols'

export class LoadSurveyResultController implements Controller {

  constructor (
    private readonly checkSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) { }

  async handle (request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId } = request

      const hasSurvey = await this.checkSurveyById.checkById(surveyId)

      if (!hasSurvey) {
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