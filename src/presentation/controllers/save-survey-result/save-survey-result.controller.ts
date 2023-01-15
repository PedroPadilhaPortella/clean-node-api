import { Controller, Forbidden, HttpRequest, HttpResponse, InvalidParamError, LoadSurveyById, Ok, SaveSurveyResult, SaveSurveyResultModel, ServerError } from './save-survey-result.protocols'

export class SaveSurveyResultController implements Controller {

  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const accountId = httpRequest.accountId

      const survey = await this.loadSurveyById.loadById(surveyId)

      if (!survey) {
        return Forbidden(new InvalidParamError('surveyId'))
      }

      const answers = survey.answers.map(a => a.answer)
      if (!answers.includes(answer)) {
        return Forbidden(new InvalidParamError('answer'))
      }

      const saveSurveyResult: SaveSurveyResultModel = {
        accountId,
        surveyId,
        answer: httpRequest.body.answer,
        date: new Date()
      }

      const surveyResult = await this.saveSurveyResult.save(saveSurveyResult)

      return Ok(surveyResult)

    } catch (error) {
      return ServerError(error)
    }
  }
}