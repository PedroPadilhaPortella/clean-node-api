import { mockLoadSurveysRepository, throwError } from '@/utils'
import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveys, LoadSurveysRepository, SURVEYS } from './db-load-surveys.protocols'

type SutTypes = {
  sut: LoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
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
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const response = sut.load()
    await expect(response).rejects.toThrow()
  })
})