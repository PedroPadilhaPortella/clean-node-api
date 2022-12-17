import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher } from "./db-add-account.protocols"

export class DbAddAccount implements AddAccount {
  private readonly addAccountRepository: AddAccountRepository
  private readonly hasher: Hasher

  constructor (addAccountRepository: AddAccountRepository, hasher: Hasher) {
    this.addAccountRepository = addAccountRepository
    this.hasher = hasher
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)
    const accountDb = await this.addAccountRepository.add({ ...account, password: hashedPassword })
    return accountDb
  }
}