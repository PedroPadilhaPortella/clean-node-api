import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = { body: {}, statusCode: 200 }
      return await new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return { sut, controllerStub }
}

describe('LogControllerDecorator', () => {

  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest: HttpRequest = {
      body: {
        name: 'pedro',
        email: 'mail@gmail.com',
        password: 'pedro123',
        passwordConfirmation: 'pedro123'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('should call return the same result of controller', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'pedro',
        email: 'mail@gmail.com',
        password: 'pedro123',
        passwordConfirmation: 'pedro123'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual({ body: {}, statusCode: 200 })
  })
})