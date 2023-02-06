import { AccountModel, AddAccount, AddAccountParams, AddAccountRepository, CheckAccountByEmailRepository, Hasher } from "./db-add-account.protocols"

export class DbAddAccount implements AddAccount {

  constructor (
    private readonly addAccountRepository: AddAccountRepository, 
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository,
    private readonly hasher: Hasher
  ) { }

  async add (accountData: AddAccountParams): Promise<AccountModel | null> {
    const hasAccount = await this.checkAccountByEmailRepository.checkByEmail(accountData.email)

    if (hasAccount) {
      return null
    }

    const hashedPassword = await this.hasher.hash(accountData.password)
    const accountDb = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return accountDb
  }
}