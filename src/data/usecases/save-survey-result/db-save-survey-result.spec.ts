import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { LoadSurveyResultRepository, mockLoadSurveyResultRepository, mockSaveSurveyResultRepository, SaveSurveyResultRepository, SAVE_SURVEY_RESULT, SURVEY_RESULT, throwError } from './db-save-survey-result.protocols'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = 
  new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
  return { sut, saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub }
}

describe('DbSaveSurveyResult', () => {
  
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const surveySpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    await sut.save(SAVE_SURVEY_RESULT)
    expect(surveySpy).toHaveBeenCalledWith(SAVE_SURVEY_RESULT)
  })

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadSurveySpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.save(SAVE_SURVEY_RESULT)
    expect(loadSurveySpy)
      .toHaveBeenCalledWith(SAVE_SURVEY_RESULT.surveyId, SAVE_SURVEY_RESULT.accountId)
  })

  it('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
    const response = sut.save(SAVE_SURVEY_RESULT)
    await expect(response).rejects.toThrow()
  })

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(throwError)
    const response = sut.save(SAVE_SURVEY_RESULT)
    await expect(response).rejects.toThrow()
  })

  it('should return a surveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(SAVE_SURVEY_RESULT)
    expect(surveyResult).toEqual(SURVEY_RESULT)
  })
})