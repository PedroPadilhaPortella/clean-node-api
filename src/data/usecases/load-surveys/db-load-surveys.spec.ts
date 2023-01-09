import { DbLoadSurveys } from './db-load-surveys'
import { SurveyModel } from '../../../domain/models/survey.model'
import { LoadSurveys } from './../../../domain/usecases/load-surveys.interface'
import { LoadSurveysRepository } from './../../protocols/load-surveys-repository.interface'
import { SURVEYS } from './../../../utils/constants'

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
})