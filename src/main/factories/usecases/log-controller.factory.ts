import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository"
import { Controller } from "../../../presentation/protocols"
import { LogControllerDecorator } from "../../decorators/log-controller.decorator"

export const createLogControllerDecoratorFactory = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}