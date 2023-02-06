import MockDate from 'mockdate'
import { LoadSurveyResultController } from './load-survey-result.controller'
import { CheckSurveyById, Forbidden, InternalServerError, InvalidParamError, LoadSurveyResult, mockCheckSurveyById, mockLoadSurveyResult, Ok, ServerError, SURVEY_RESULT, throwInternalServerError } from './load-survey-result.protocols'

type SutTypes = {
  sut: LoadSurveyResultController
  checkSurveyByIdStub: CheckSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdStub = mockCheckSurveyById()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(checkSurveyByIdStub, loadSurveyResultStub)
  return { sut, checkSurveyByIdStub, loadSurveyResultStub }
}

const makeFakeRequest = (): LoadSurveyResultController.Request => {
  return { surveyId: '1', accountId: '1' }
}

describe('LoadSurveyResultController', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call CheckSurveyById with correct value', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(checkSurveyByIdStub, 'checkById')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(loadByIdSpy).toHaveBeenCalledWith(request.surveyId)
  })

  it('should return 403 if CheckSurveyById returns false', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    jest.spyOn(checkSurveyByIdStub, 'checkById').mockReturnValue(Promise.resolve(false))
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(Forbidden(new InvalidParamError('surveyId')))
  })

  it('should return 500 if CheckSurveyById throws', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    jest.spyOn(checkSurveyByIdStub, 'checkById').mockImplementationOnce(throwInternalServerError)
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ServerError(new InternalServerError('Error')))
  })
  
  it('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSurveyResultSpy = jest.spyOn(loadSurveyResultStub, 'loadBySurveyId')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(loadSurveyResultSpy)
      .toHaveBeenCalledWith(request.surveyId, request.accountId)
  })

  it('should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'loadBySurveyId')
      .mockImplementationOnce(throwInternalServerError)
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ServerError(new InternalServerError('Error')))
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(Ok(SURVEY_RESULT))
  })
})