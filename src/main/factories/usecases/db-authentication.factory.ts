import { DbAuthentication } from "@/data/usecases/authentication/db-authentication"
import { Authentication } from "@/domain/usecases/authentication.interface"
import { BCryptAdapter } from "@/infra/criptography/bcrypt.adapter"
import { JwtAdapter } from "@/infra/criptography/jwt.adapter"
import { AccountMongoRepository } from "@/infra/db/mongodb/account/account-mongo-repository"
import env from "@/main/config/env"

export const createDbAuthenticationFactory = (): Authentication => {
  const bCryptAdapter = new BCryptAdapter(env.salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(accountMongoRepository, bCryptAdapter, jwtAdapter, accountMongoRepository)
}