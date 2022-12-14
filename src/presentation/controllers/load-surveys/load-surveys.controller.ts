
import { Controller, HttpRequest, HttpResponse, Ok, LoadSurveys, ServerError, NoContent } from './load-surveys.protocols'

export class LoadSurveysController implements Controller {

  constructor (private readonly loadSurveys: LoadSurveys) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return surveys.length ? Ok(surveys) : NoContent()
    } catch (error) {
      return ServerError(error)
    }
  }
}