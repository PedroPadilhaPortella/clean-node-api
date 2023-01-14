import MockDate from 'mockdate'
import { SaveSurveyResultController } from './save-survey-result.controller'
import { Forbidden, HttpRequest, InvalidParamError, LoadSurveyById, SaveSurveyResult, SaveSurveyResultModel, SURVEY, SurveyModel, SurveyResultModel, SURVEY_RESULT } from './save-survey-result.protocols'

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
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(Forbidden(new InvalidParamError('surveyId')))
  })
})