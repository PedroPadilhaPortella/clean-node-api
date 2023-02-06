
import { Controller, HttpResponse, Ok, LoadSurveys, ServerError, NoContent } from './load-surveys.protocols'

export class LoadSurveysController implements Controller {

  constructor (private readonly loadSurveys: LoadSurveys) { }

  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const { accountId } = request

      const surveys = await this.loadSurveys.load(accountId)
      return surveys.length ? Ok(surveys) : NoContent()
      
    } catch (error) {
      return ServerError(error)
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
    accountId: string
  }
}