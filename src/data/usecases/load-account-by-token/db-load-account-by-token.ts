import { LoadAccountByToken, AccountModel, LoadAccountByTokenRepository, Decrypter } from './db-load-account-by-token.protocols'

export class DbLoadAcccountByToken implements LoadAccountByToken {

  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) { }

  async load (token: string, role?: string): Promise<AccountModel> {
    const accessToken = await this.decrypter.decrypt(token)
    if (!accessToken) return null

    const account = await this.loadAccountByTokenRepository.loadByToken(token, role)
    if (!account) return null
    
    return account
  }
}