import { Decrypter } from '../../protocols/decrypter.interface'
import { AccountModel } from '../add-account/db-add-account.protocols'
import { LoadAccountByToken } from './../../../domain/usecases/load-account-by-token.interface'

export class DbLoadAcccountByToken implements LoadAccountByToken {

  constructor (
    private readonly decrypter: Decrypter
  ) { }

  async load (token: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(token)
    return null
  }
}