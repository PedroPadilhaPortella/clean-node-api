import MockDate from 'mockdate'
import { LoadSurveysController } from './load-surveys.controller'
import { InternalServerError, LoadSurveys, mockLoadSurveys, NoContent, Ok, ServerError, SURVEYS, throwInternalServerError, ACCOUNT } from './load-surveys.protocols'

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return { sut, loadSurveysStub }
}

const request: LoadSurveysController.Request = { accountId: ACCOUNT.id.toString() }

describe('LoadSurveysController', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveys with correct values', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.accountId)
  })
  
  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(request)
    expect(response).toEqual(Ok(SURVEYS))
  })
  
  it('should return 500 on fails', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwInternalServerError)
    const response = await sut.handle(request)
    expect(response).toEqual(ServerError(new InternalServerError('Error')))
  })
  
  it('should return 204 if there is no surveys to show', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const response = await sut.handle(request)
    expect(response).toEqual(NoContent())
  })
})