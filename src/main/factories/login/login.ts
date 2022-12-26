import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication"
import { BCryptAdapter } from '../../../infra/criptography/bcrypt.adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt.adapter'
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository"
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository"
import { LoginController } from "../../../presentation/controllers/login/login.controller"
import { Controller } from "../../../presentation/protocols"
import env from '../../config/env'
import { LogControllerDecorator } from "../../decorators/log-controller.decorator"
import { createLoginValidations } from "./login-validation"

export const LoginControllerFactory = (): Controller => {
  const bCryptAdapter = new BCryptAdapter(env.salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const validations = createLoginValidations()
  const dbAuthentication = 
    new DbAuthentication(accountMongoRepository, bCryptAdapter, jwtAdapter, accountMongoRepository)

  const loginController = new LoginController(dbAuthentication, validations)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}