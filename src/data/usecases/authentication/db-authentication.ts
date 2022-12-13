import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication.interface"
import { LoadAccountByEmailRepository } from "../../protocols/load-account-repository.interface"

export class DbAuthentication implements Authentication {

  private readonly loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository

  constructor (loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepositoryStub = loadAccountByEmailRepositoryStub
  }

  async authenticate (authentication: AuthenticationModel): Promise<string> {
    return (await this.loadAccountByEmailRepositoryStub.load(authentication.email)).email
  }

}