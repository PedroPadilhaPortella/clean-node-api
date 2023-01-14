import { Controller, Forbidden, HttpRequest, HttpResponse, InvalidParamError, LoadSurveyById, SaveSurveyResult, ServerError } from './save-survey-result.protocols'

export class SaveSurveyResultController implements Controller {

  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyId = httpRequest.params.surveyId
      const survey = await this.loadSurveyById.loadById(surveyId)

      if (!survey) {
        return Forbidden(new InvalidParamError('surveyId'))
      }

    } catch (error) {
      return ServerError(error)
    }
  }
}