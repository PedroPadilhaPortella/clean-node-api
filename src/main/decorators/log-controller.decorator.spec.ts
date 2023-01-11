import { LogErrorRepository } from "../../data/protocols/log-error-repository.interface"
import { InternalServerError } from "../../presentation/errors"
import { Ok, ServerError } from "../../presentation/helpers/http/http.helper"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { SIGNUP } from './../../utils/constants'
import { LogControllerDecorator } from "./log-controller.decorator"

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = { body: {}, statusCode: 200 }
      return await new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stackError: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut, controllerStub, logErrorRepositoryStub }
}

const makeFakeRequest = (): HttpRequest => ({
  body: { SIGNUP }
})

describe('LogControllerDecorator', () => {

  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    expect(httpResponse).toEqual(Ok({}))
  })

  it('should call LogErrorRepository when controller returns a InternalServerError', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const error = new InternalServerError('Error Stack')
    
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise(resolve => resolve(ServerError(error))))

    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('Error Stack')
    expect(response).toEqual(ServerError(error))
  })
})