import { createDbAddAccountFactory } from '@/main/factories/usecases/db-add-account.factory'
import { createDbAuthenticationFactory } from '@/main/factories/usecases/db-authentication.factory'
import { createLogControllerDecoratorFactory } from '@/main/factories/usecases/log-controller.factory'
import { SignUpController } from '@/presentation/controllers/signup/signup.controller'
import { Controller } from '@/presentation/protocols'
import { createSignUpValidations } from './signup-validation'

export const SignUpControllerFactory = (): Controller => {
  const dbAddAccount = createDbAddAccountFactory()
  const validations = createSignUpValidations()
  const dbAuthentication = createDbAuthenticationFactory()
  const signUpController = new SignUpController(dbAddAccount, validations, dbAuthentication)
  return createLogControllerDecoratorFactory(signUpController)
}