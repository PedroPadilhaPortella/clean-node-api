import { Controller, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult, ServerError } from './save-survey-result.protocols'

export class SaveSurveyResultController implements Controller {

  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyId = httpRequest.params.surveyId
      await this.loadSurveyById.loadById(surveyId)
    } catch (error) {
      return ServerError(error)
    }
  }
}