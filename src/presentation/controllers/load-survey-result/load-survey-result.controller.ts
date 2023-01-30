import { Controller, Forbidden, HttpRequest, HttpResponse, InvalidParamError, LoadSurveyById, ServerError, LoadSurveyResult, Ok } from './load-survey-result.protocols'

export class LoadSurveyResultController implements Controller {

  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { accountId } = httpRequest

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