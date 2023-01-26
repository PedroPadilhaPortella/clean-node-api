import MockDate from 'mockdate'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResult, LoadSurveyResultRepository, mockLoadSurveyResultRepository, SURVEY_RESULT, throwError } from './db-load-survey-result.protocols'

type SutTypes = {
  sut: LoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
  return { sut, loadSurveyResultRepositoryStub }
}

describe('DbLoadSurveyResult', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call loadSurveyResultRepository with correct id', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.loadBySurveyId('id_123')
    expect(loadSpy).toHaveBeenCalledWith('id_123')
  })

  it('should return a surveyResult on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadBySurveyId('id_123')
    expect(survey).toEqual(SURVEY_RESULT)
  })

  it('should throw if loadSurveysRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const response = sut.loadBySurveyId('1')
    await expect(response).rejects.toThrow()
  })
})