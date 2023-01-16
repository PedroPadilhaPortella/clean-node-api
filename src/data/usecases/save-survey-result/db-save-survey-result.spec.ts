import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel, SURVEY_RESULT, SAVE_SURVEY_RESULT } from './db-save-survey-result.protocols'

const createSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return SURVEY_RESULT
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = createSaveSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return { sut, saveSurveyResultRepositoryStub }
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

  it('should return a surveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(SAVE_SURVEY_RESULT)
    expect(surveyResult).toEqual(SURVEY_RESULT)
  })
    
  it('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const response = sut.save(SAVE_SURVEY_RESULT)
    await expect(response).rejects.toThrow()
  })
})