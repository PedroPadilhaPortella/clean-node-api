import { HttpRequest } from './../../protocols/http.interface'
import { Validation } from '../../protocols/validation.interface'
import { AddSurveyController } from './add-survey.controller'

const createValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = createValidation()
  const sut = new AddSurveyController(validationStub)
  return { sut, validationStub }
}

const makeFakeRequest = (): HttpRequest => {
  return { 
    body: { 
      question: 'question', 
      answers: ['answer1', 'answer2', 'answer3']
    }
  }
}

describe('AddSurveyController', () => {

  it('should call validation with correct body', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})