import MockDate from 'mockdate'
import { AddSurveyController } from './add-survey.controller'
import { AddSurvey, AddSurveyModel, BadRequest, HttpRequest, InternalServerError, MissingParamError, NoContent, ServerError, Validation, SURVEY } from './add-survey.protocols'

const createAddSurveyStub = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new AddSurveyStub()
}

const createValidationStub = (): Validation => {
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
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const addSurveyStub = createAddSurveyStub()
  const validationStub = createValidationStub()
  const sut = new AddSurveyController(addSurveyStub, validationStub)
  return { sut, validationStub, addSurveyStub }
}

const makeFakeRequest = (): HttpRequest => {
  return { body: { ...SURVEY, date: new Date() } }
}

describe('AddSurveyController', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

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

  it('should call addSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const surveySpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(surveySpy).toHaveBeenCalledWith(httpRequest.body)
  })
  
  it('should return 500 if authenticate throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new InternalServerError('Erro'))))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ServerError(new InternalServerError('Erro')))
  })

  it('should return 204 when valid fields are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(NoContent())
  })
})