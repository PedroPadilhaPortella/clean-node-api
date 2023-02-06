
import { AddSurvey, BadRequest, Controller, HttpResponse, NoContent, ServerError, Validation } from './add-survey.protocols'

export class AddSurveyController implements Controller {

  constructor (
    private readonly addSurvey: AddSurvey,
    private readonly validation: Validation
  ) { }

  async handle (request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return BadRequest(error)
      }
      
      const { question, answers } = request
      await this.addSurvey.add({ question, answers, date: new Date() })

      return NoContent()

    } catch (error) {
      return ServerError(error)
    }
  }
}

export namespace AddSurveyController {
  export type Request = {
    question: string
    answers: Answer[]
  }

  type Answer = {
    answer: string
    image?: string
  }
}