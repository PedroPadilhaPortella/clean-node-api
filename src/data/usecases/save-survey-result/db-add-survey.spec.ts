import MockDate from 'mockdate'
import { DbAddSurvey } from './db-add-survey'
import { AddSurveyModel, AddSurveyRepository, ADD_SURVEY } from './db-add-survey.protocols'

const createAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (account: AddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new AddSurveyRepositoryStub()
}

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = createAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return { sut, addSurveyRepositoryStub }
}

describe('DbAddSurvey', () => {
  
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const surveySpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(ADD_SURVEY)
    expect(surveySpy).toHaveBeenCalledWith(ADD_SURVEY)
  })
    
  it('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add')
      .mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const response = sut.add(ADD_SURVEY)
    await expect(response).rejects.toThrow()
  })
})