import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository, SurveyModel, SURVEY } from './db-load-survey-by-id.protocols'

const createLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel | null> {
      return SURVEY
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = createLoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return { sut, loadSurveyByIdRepositoryStub }
}

describe('DbLoadSurveyById', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call loadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('id_123')
    expect(loadSpy).toHaveBeenCalledWith('id_123')
  })

  it('should return a survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('id_123')
    expect(survey).toEqual(SURVEY)
  })

  it('should throw if loadSurveysRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const response = sut.loadById('1')
    await expect(response).rejects.toThrow()
  })
})