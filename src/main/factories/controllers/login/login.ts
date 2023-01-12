import { createDbAuthenticationFactory } from "@/main/factories/usecases/db-authentication.factory"
import { createLogControllerDecoratorFactory } from "@/main/factories/usecases/log-controller.factory"
import { LoginController } from "@/presentation/controllers/login/login.controller"
import { Controller } from "@/presentation/protocols"
import { createLoginValidations } from "./login-validation"

export const LoginControllerFactory = (): Controller => {
  const validations = createLoginValidations()
  const dbAuthentication = createDbAuthenticationFactory()
  const loginController = new LoginController(dbAuthentication, validations)
  return createLogControllerDecoratorFactory(loginController)
}