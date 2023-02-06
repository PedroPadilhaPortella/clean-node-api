import { DbCheckSurveyById } from './db-check-survey-by-id'
import { CheckSurveyByIdRepository, mockCheckSurveyByIdRepository, throwError } from './db-check-survey-by-id.protocols'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositoryStub: CheckSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositoryStub = mockCheckSurveyByIdRepository()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositoryStub)
  return { sut, checkSurveyByIdRepositoryStub }
}

describe('DbLoadSurveyById', () => {

  it('should call loadSurveyByIdRepository with correct id', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById')
    await sut.checkById('id_123')
    expect(loadSpy).toHaveBeenCalledWith('id_123')
  })

  it('should return true if loadSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut()
    const survey = await sut.checkById('id_123')
    expect(survey).toEqual(true)
  })

  it('should return false if loadSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockReturnValueOnce(Promise.resolve(false))
    const survey = await sut.checkById('id_123')
    expect(survey).toBeFalsy()
  })

  it('should throw if loadSurveysRepository throws', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockImplementationOnce(throwError)
    const response = sut.checkById('1')
    await expect(response).rejects.toThrow()
  })
})