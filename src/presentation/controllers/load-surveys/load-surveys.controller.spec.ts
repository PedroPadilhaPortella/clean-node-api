import MockDate from 'mockdate'
import { LoadSurveysController } from './load-surveys.controller'
import { InternalServerError, LoadSurveys, mockLoadSurveys, NoContent, Ok, ServerError, SURVEYS, throwInternalServerError } from './load-surveys.protocols'

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return { sut, loadSurveysStub }
}

describe('LoadSurveysController', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
  
  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(Ok(SURVEYS))
  })
  
  it('should return 500 on fails', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwInternalServerError)
    const response = await sut.handle({})
    expect(response).toEqual(ServerError(new InternalServerError('Error')))
  })
  
  it('should return 204 if there is no surveys to show', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load')
      .mockReturnValueOnce(new Promise(resolve => resolve([])))
    const response = await sut.handle({})
    expect(response).toEqual(NoContent())
  })
})