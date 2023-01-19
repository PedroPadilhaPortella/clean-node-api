import { LogErrorRepository } from "@/data/protocols/log-error-repository.interface"
import { InternalServerError } from "@/presentation/errors"
import { Ok, ServerError } from "@/presentation/helpers/http/http.helper"
import { Controller, HttpRequest } from "@/presentation/protocols"
import { createLogErrorRepository, mockController, SIGNUP } from "@/utils/tests"
import { LogControllerDecorator } from "./log-controller.decorator"

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = mockController()
  const logErrorRepositoryStub = createLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut, controllerStub, logErrorRepositoryStub }
}

const makeFakeRequest = (): HttpRequest => ({ body: { SIGNUP } })

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
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(ServerError(error)))

    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('Error Stack')
    expect(response).toEqual(ServerError(error))
  })
})