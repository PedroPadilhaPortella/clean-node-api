import MockDate from 'mockdate'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyByIdRepository, LoadSurveyResult, LoadSurveyResultRepository, mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository, SURVEY_RESULT, throwError } from './db-load-survey-result.protocols'

type SutTypes = {
  sut: LoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)
  return { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub }
}

describe('DbLoadSurveyResult', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call loadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.loadBySurveyId('id_123', 'id_456')
    expect(loadSpy).toHaveBeenCalledWith('id_123', 'id_456')
  })

  it('should throw if loadSurveysRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const response = sut.loadBySurveyId('id_123', 'id_456')
    await expect(response).rejects.toThrow()
  })
  
  it('should return a surveyResult on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadBySurveyId('id_123', 'id_456')
    expect(survey).toEqual(SURVEY_RESULT)
  })

  it('should call LoadSurveyByIdRepository if loadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(null)
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadBySurveyId('id_123', 'id_456')
    expect(loadByIdSpy).toHaveBeenCalledWith('id_123')
  })

  it('should return surveyResult from loadBySurveyId if loadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(null)
    const survey = await sut.loadBySurveyId('id_123', 'id_456')
    expect(survey.surveyId).toEqual(SURVEY_RESULT.surveyId)
    expect(survey.question).toEqual(SURVEY_RESULT.question)
    expect(survey.answers).toEqual(SURVEY_RESULT.answers)
  })
  
  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(null)
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
    const response = sut.loadBySurveyId('id_123', 'id_456')
    await expect(response).rejects.toThrow()
  })
})