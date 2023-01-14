import MockDate from 'mockdate'
import { SaveSurveyResultController } from './save-survey-result.controller'
import { ACCOUNT, AccountModel, Forbidden, HttpRequest, InternalServerError, InvalidParamError, LoadAccountByToken, LoadSurveyById, SaveSurveyResult, SaveSurveyResultModel, ServerError, SURVEY, SurveyModel, SurveyResultModel, SURVEY_RESULT } from './save-survey-result.protocols'

const createLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return SURVEY
    }
  }
  return new LoadSurveyByIdStub()
}

const createLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (token: string, role?: string | undefined): Promise<AccountModel | null> {
      return ACCOUNT
    }
  }
  return new LoadAccountByTokenStub()
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
  loadAccountByToken: LoadAccountByToken
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = createSaveSurveyResultStub()
  const loadAccountByToken = createLoadAccountByTokenStub()
  const loadSurveyByIdStub = createLoadSurveyByIdStub()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, loadAccountByToken, saveSurveyResultStub)
  return { sut, loadSurveyByIdStub, loadAccountByToken, saveSurveyResultStub }
}

const makeFakeRequest = (): HttpRequest => {
  return { 
    body: { },
    headers: { },
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
  
  it('should call SaveSurveyResult with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.params.surveyId)
  })
})