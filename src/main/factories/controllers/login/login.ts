import { LoginController } from "../../../../presentation/controllers/login/login.controller"
import { Controller } from "../../../../presentation/protocols"
import { createDbAuthenticationFactory } from "../../usecases/db-authentication.factory"
import { createLogControllerDecoratorFactory } from "../../usecases/log-controller.factory"
import { createLoginValidations } from "./login-validation"

export const LoginControllerFactory = (): Controller => {
  const validations = createLoginValidations()
  const dbAuthentication = createDbAuthenticationFactory()
  const loginController = new LoginController(dbAuthentication, validations)
  return createLogControllerDecoratorFactory(loginController)
}