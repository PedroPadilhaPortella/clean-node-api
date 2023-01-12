import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveys, LoadSurveysRepository, SurveyModel, SURVEYS } from './db-load-surveys.protocols'

const createLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return SURVEYS
    }
  }
  return new LoadSurveysRepositoryStub()
}

interface SutTypes {
  sut: LoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = createLoadSurveysRepositoryStub()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return { sut, loadSurveysRepositoryStub }
}

describe('DbLoadSurveys', () => {

  it('should call loadSurveysRepository with correct values', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })
  
  it('should return all surveys', async () => {
    const { sut } = makeSut()
    const response = await sut.load()
    expect(response).toEqual(SURVEYS)
  })

  it('should throw if loadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const response = sut.load()
    await expect(response).rejects.toThrow()
  })
})