import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveys, LoadSurveysRepository, SURVEYS, mockLoadSurveysRepository, throwError, ACCOUNT } from './db-load-surveys.protocols'

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

  const accountId = ACCOUNT.id.toString()

  it('should call loadSurveysRepository with correct values', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load(accountId)
    expect(loadSpy).toHaveBeenCalledWith(accountId)
  })
  
  it('should return all surveys', async () => {
    const { sut } = makeSut()
    const response = await sut.load(accountId)
    expect(response).toEqual(SURVEYS)
  })

  it('should throw if loadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const response = sut.load(accountId)
    await expect(response).rejects.toThrow()
  })
})