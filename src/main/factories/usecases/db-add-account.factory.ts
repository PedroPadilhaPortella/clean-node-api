import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'
import { AddAccount } from '@/domain/usecases/add-account.interface'
import { BCryptAdapter } from '@/infra/criptography/bcrypt.adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import env from '@/main/config/env'

export const createDbAddAccountFactory = (): AddAccount => {
  const bCryptAdapter = new BCryptAdapter(env.salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(accountMongoRepository, accountMongoRepository, bCryptAdapter)
}