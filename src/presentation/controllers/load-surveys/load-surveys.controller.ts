
import { Controller, HttpRequest, HttpResponse, NoContent, LoadSurveys } from './load-surveys.protocols'

export class LoadSurveysController implements Controller {

  constructor (private readonly loadSurveys: LoadSurveys) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load()
    return await new Promise(resolve => resolve(NoContent()))
  }
}