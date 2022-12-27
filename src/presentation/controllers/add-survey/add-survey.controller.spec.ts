import { AddSurveyController } from './add-survey.controller'
import { BadRequest, HttpRequest, MissingParamError, Validation } from './add-survey.protocols'

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
  
  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('any_field')))
  })
})