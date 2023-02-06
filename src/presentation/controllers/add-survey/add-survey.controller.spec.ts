import MockDate from 'mockdate'
import { AddSurveyController } from './add-survey.controller'
import { AddSurvey, ADD_SURVEY, BadRequest, InternalServerError, MissingParamError, NoContent, ServerError, Validation, mockAddSurvey, mockValidation, throwInternalServerError } from './add-survey.protocols'

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const addSurveyStub = mockAddSurvey()
  const validationStub = mockValidation()
  const sut = new AddSurveyController(addSurveyStub, validationStub)
  return { sut, validationStub, addSurveyStub }
}

const makeFakeRequest = (): AddSurveyController.Request => {
  return ADD_SURVEY
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
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })
  
  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('any_field')))
  })

  it('should call addSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const surveySpy = jest.spyOn(addSurveyStub, 'add')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(surveySpy).toHaveBeenCalledWith({ ...request, date: new Date() })
  })
  
  it('should return 500 if authenticate throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwInternalServerError)
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ServerError(new InternalServerError('Error')))
  })

  it('should return 204 when valid fields are provided', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(NoContent())
  })
})