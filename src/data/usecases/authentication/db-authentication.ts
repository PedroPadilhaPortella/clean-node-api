import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication.interface"
import { HashComparer } from "../../protocols/hash-comparer.interface"
import { LoadAccountByEmailRepository } from "../../protocols/load-account-repository.interface"

export class DbAuthentication implements Authentication {

  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository, 
    hashComparer: HashComparer
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async authenticate (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)

    if (account) {
      await this.hashComparer.compare(authentication.password, account.password)
    }

    return null
  }
}