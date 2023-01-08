
import { Controller, HttpRequest, HttpResponse, Ok, LoadSurveys, ServerError } from './load-surveys.protocols'

export class LoadSurveysController implements Controller {

  constructor (private readonly loadSurveys: LoadSurveys) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return Ok(surveys)
    } catch (error) {
      return ServerError(error)
    }
  }
}