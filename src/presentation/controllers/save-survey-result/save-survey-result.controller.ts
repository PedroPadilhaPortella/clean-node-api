import { Controller, Forbidden, HttpResponse, InvalidParamError, LoadSurveyById, Ok, SaveSurveyResult, ServerError } from './save-survey-result.protocols'

export class SaveSurveyResultController implements Controller {

  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { accountId, surveyId, answer } = request

      const survey = await this.loadSurveyById.loadById(surveyId)

      if (!survey) {
        return Forbidden(new InvalidParamError('surveyId'))
      }

      const answers = survey.answers.map(a => a.answer)
      if (!answers.includes(answer)) {
        return Forbidden(new InvalidParamError('answer'))
      }

      const saveSurveyResult: SaveSurveyResult.Params = {
        accountId,
        surveyId,
        answer,
        date: new Date()
      }

      const surveyResult = await this.saveSurveyResult.save(saveSurveyResult)

      return Ok(surveyResult)

    } catch (error) {
      return ServerError(error)
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    accountId: string
    surveyId: string
    answer: string
  }
}