import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication.interface"
import { HashComparer } from "../../protocols/hash-comparer.interface"
import { LoadAccountByEmailRepository } from "../../protocols/load-account-repository.interface"
import { TokenGenerator } from "../../protocols/token-generator.interface"
import { UpdateAccessTokenRepository } from "../../protocols/update-access-token-repository.interface"

export class DbAuthentication implements Authentication {

  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository, 
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async authenticate (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)

    if (account) {
      const passwordMatch = await this.hashComparer.compare(authentication.password, account.password)

      if (passwordMatch) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}