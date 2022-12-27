import { SignUpController } from '../../../../presentation/controllers/signup/signup.controller'
import { Controller } from '../../../../presentation/protocols'
import { createDbAddAccountFactory } from '../../usecases/db-add-account.factory'
import { createDbAuthenticationFactory } from '../../usecases/db-authentication.factory'
import { createLogControllerDecoratorFactory } from '../../usecases/log-controller.factory'
import { createSignUpValidations } from './signup-validation'

export const SignUpControllerFactory = (): Controller => {
  const dbAddAccount = createDbAddAccountFactory()
  const validations = createSignUpValidations()
  const dbAuthentication = createDbAuthenticationFactory()
  const signUpController = new SignUpController(dbAddAccount, validations, dbAuthentication)
  return createLogControllerDecoratorFactory(signUpController)
}