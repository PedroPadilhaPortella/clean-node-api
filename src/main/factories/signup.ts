import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { BCryptAdapter } from '../../infra/criptography/bcrypt.adapter'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email.validator.adapter'

export const SignUpControllerFactory = (): SignUpController => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(accountMongoRepository, bCryptAdapter)
  return new SignUpController(dbAddAccount, emailValidator)
}