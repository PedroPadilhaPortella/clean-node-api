import MockDate from 'mockdate'
import { SaveSurveyResultController } from './save-survey-result.controller'
import { Forbidden, HttpRequest, InternalServerError, InvalidParamError, LoadSurveyById, Ok, SaveSurveyResult, SaveSurveyResultModel, SAVE_SURVEY_RESULT, ServerError, SURVEY, SurveyModel, SurveyResultModel, SURVEY_RESULT } from './save-survey-result.protocols'

const createLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return SURVEY
    }
  }
  return new LoadSurveyByIdStub()
}

const createSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResult implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return SURVEY_RESULT
    }
  }
  return new SaveSurveyResult()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = createSaveSurveyResultStub()
  const loadSurveyByIdStub = createLoadSurveyByIdStub()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return { sut, loadSurveyByIdStub, saveSurveyResultStub }
}

const makeFakeRequest = (): HttpRequest => {
  return { 
    body: { answer: 'answer1' },
    accountId: '1',
    params: { surveyId: '1' }
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
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.params.surveyId)
  })

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValue(new Promise(resolve => resolve(null)))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(Forbidden(new InvalidParamError('surveyId')))
  })

  it('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new InternalServerError('Erro'))))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ServerError(new InternalServerError('Erro')))
  })

  it('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle({ ...httpRequest, body: { answer: 'invalid answer' } })
    expect(httpResponse).toEqual(Forbidden(new InvalidParamError('answer')))
  })
  
  it('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(saveSpy).toHaveBeenCalledWith({ ...SAVE_SURVEY_RESULT, date: new Date() })
  })

  it('should return 500 if LoadSurveSaveSurveyResultyById throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new InternalServerError('Erro'))))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ServerError(new InternalServerError('Erro')))
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(Ok(SURVEY_RESULT))
  })
})