import { DbLoadAcccountByToken } from "@/data/usecases/load-account-by-token/db-load-account-by-token"
import { LoadAccountByToken } from "@/domain/usecases/load-account-by-token.interface"
import { JwtAdapter } from "@/infra/criptography/jwt.adapter"
import { AccountMongoRepository } from "@/infra/db/mongodb/account/account-mongo-repository"
import env from "@/main/config/env"

export const createDbLoadAccountByTokenFactory = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAcccountByToken(jwtAdapter, accountMongoRepository)
}