import { AccountModel, AddAccount, AddAccountParams, AddAccountRepository, Hasher, LoadAccountByEmailRepository } from "./db-add-account.protocols"

export class DbAddAccount implements AddAccount {

  constructor (
    private readonly addAccountRepository: AddAccountRepository, 
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasher: Hasher
  ) { }

  async add (account: AddAccountParams): Promise<AccountModel | null> {
    const accountByEmail = await this.loadAccountByEmailRepository.loadByEmail(account.email)

    if (accountByEmail) {
      return null
    }

    const hashedPassword = await this.hasher.hash(account.password)
    const accountDb = await this.addAccountRepository.add({ ...account, password: hashedPassword })
    return accountDb
  }
}