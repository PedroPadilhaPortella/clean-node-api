import { BadRequest, Controller, HttpRequest, HttpResponse, ServerError, Validation } from './add-survey.protocols'

export class AddSurveyController implements Controller {

  constructor (
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      // const { question, answer } = httpRequest.body

      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return BadRequest(error)
      }

    } catch (error) {
      return ServerError(error)
    }
  }
}