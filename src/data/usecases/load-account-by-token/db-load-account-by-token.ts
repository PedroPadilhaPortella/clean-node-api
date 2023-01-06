import { Decrypter } from '../../protocols/decrypter.interface'
import { LoadAccountByTokenRepository } from '../../protocols/load-account-by-token-repository.interface'
import { AccountModel } from '../add-account/db-add-account.protocols'
import { LoadAccountByToken } from './../../../domain/usecases/load-account-by-token.interface'

export class DbLoadAcccountByToken implements LoadAccountByToken {

  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) { }

  async load (token: string, role?: string): Promise<AccountModel> {
    const accessToken = await this.decrypter.decrypt(token)
    if (!accessToken) return null

    const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    if (!account) return null
    
    return account
  }
}