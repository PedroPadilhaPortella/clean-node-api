import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../infra/criptography/bcrypt.adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email.validator.adapter'
import { LogControllerDecorator } from '../decorators/log'

export const SignUpControllerFactory = (): Controller => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(accountMongoRepository, bCryptAdapter)
  const signUpController = new SignUpController(dbAddAccount, emailValidator)
  return new LogControllerDecorator(signUpController)
}