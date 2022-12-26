import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BCryptAdapter } from '../../../infra/criptography/bcrypt.adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt.adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { SignUpController } from '../../../presentation/controllers/signup/signup.controller'
import { Controller } from '../../../presentation/protocols'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/log-controller.decorator'
import { createSignUpValidations } from './signup-validation'

export const SignUpControllerFactory = (): Controller => {
  const bCryptAdapter = new BCryptAdapter(env.salt)
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const dbAddAccount = new DbAddAccount(accountMongoRepository, bCryptAdapter)
  const validations = createSignUpValidations()
  const dbAuthentication = 
    new DbAuthentication(accountMongoRepository, bCryptAdapter, jwtAdapter, accountMongoRepository)
  
  const signUpController = new SignUpController(dbAddAccount, validations, dbAuthentication)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}