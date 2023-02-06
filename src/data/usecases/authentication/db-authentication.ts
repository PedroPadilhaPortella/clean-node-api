import { Authentication, Encrypter, HashComparer, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from "./db-authentication.protocols"

export class DbAuthentication implements Authentication {

  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository, 
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async authenticate (authentication: Authentication.Params): Promise<Authentication.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)

    if (account) {
      const passwordMatch = await this.hashComparer.compare(authentication.password, account.password)

      if (passwordMatch) {
        const accessToken = await this.encrypter.encrypt(account.id.toString())
        await this.updateAccessTokenRepository.updateToken(account.id, accessToken)
        return { accessToken, name: account.name }
      }
    }
    return null
  }
}