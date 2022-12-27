
import { AddSurvey, BadRequest, Controller, HttpRequest, HttpResponse, NoContent, ServerError, Validation } from './add-survey.protocols'

export class AddSurveyController implements Controller {

  constructor (
    private readonly addSurvey: AddSurvey,
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return BadRequest(error)
      }
      
      const { question, answers } = httpRequest.body
      await this.addSurvey.add({ question, answers })

      return NoContent()

    } catch (error) {
      return ServerError(error)
    }
  }
}