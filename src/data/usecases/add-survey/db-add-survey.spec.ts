import { DbAddSurvey } from './db-add-survey'
import { AddSurveyModel, AddSurveyRepository } from './db-add-survey.protocols'

const createAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (account: AddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new AddSurveyRepositoryStub()
}

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = createAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return { sut, addSurveyRepositoryStub }
}

const makeFakeSurvey = (): AddSurveyModel => ({
  question: 'question',
  answers: [
    { answer: 'answer1' },
    { answer: 'answer2' },
    { answer: 'answer3' }
  ]
})

describe('DbAddSurvey', () => {
  
  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const surveySpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(makeFakeSurvey())
    expect(surveySpy).toHaveBeenCalledWith(makeFakeSurvey())
  })
    
  it('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add')
      .mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const response = sut.add(makeFakeSurvey())
    await expect(response).rejects.toThrow()
  })
})