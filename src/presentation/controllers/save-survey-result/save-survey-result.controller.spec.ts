import MockDate from 'mockdate'
import { SaveSurveyResultController } from './save-survey-result.controller'
import { Forbidden, InternalServerError, InvalidParamError, LoadSurveyById, mockLoadSurveyById, mockSaveSurveyResult, Ok, SaveSurveyResult, SAVE_SURVEY_RESULT, ServerError, SURVEY_RESULT, throwInternalServerError } from './save-survey-result.protocols'

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = mockSaveSurveyResult()
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return { sut, loadSurveyByIdStub, saveSurveyResultStub }
}

const makeFakeRequest = (): SaveSurveyResultController.Request => {
  return { 
    surveyId: '1',
    accountId: '1',
    answer: 'answer1'
  }
}

describe('SaveSurveyResultController', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(loadByIdSpy).toHaveBeenCalledWith(request.surveyId)
  })

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValue(Promise.resolve(null))
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(Forbidden(new InvalidParamError('surveyId')))
  })

  it('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwInternalServerError)
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ServerError(new InternalServerError('Error')))
  })

  it('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    const httpResponse = await sut.handle({ ...request, answer: 'invalid answer' })
    expect(httpResponse).toEqual(Forbidden(new InvalidParamError('answer')))
  })
  
  it('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(saveSpy).toHaveBeenCalledWith({ ...SAVE_SURVEY_RESULT, date: new Date() })
  })

  it('should return 500 if LoadSurveSaveSurveyResultyById throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwInternalServerError)
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