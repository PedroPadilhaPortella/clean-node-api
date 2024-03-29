import MockDate from 'mockdate'
import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository, ADD_SURVEY, mockAddSurveyRepository, throwError } from './db-add-survey.protocols'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
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
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError)
    const response = sut.add(ADD_SURVEY)
    await expect(response).rejects.toThrow()
  })
})