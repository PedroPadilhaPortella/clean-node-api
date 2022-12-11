import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../infra/criptography/bcrypt.adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email.validator.adapter'
import { LogControllerDecorator } from '../decorators/log'
import { createSignUpValidations } from './signup-validation'

export const SignUpControllerFactory = (): Controller => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const bCryptAdapter = new BCryptAdapter(salt)
  const logMongoRepository = new LogMongoRepository()
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(accountMongoRepository, bCryptAdapter)
  const validations = createSignUpValidations()
  const signUpController = new SignUpController(dbAddAccount, emailValidator, validations)
  return new LogControllerDecorator(signUpController, logMongoRepository)
}