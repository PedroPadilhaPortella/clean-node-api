import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher } from "./db-add-account.protocols"

export class DbAddAccount implements AddAccount {

  constructor (
    private readonly addAccountRepository: AddAccountRepository, 
    private readonly hasher: Hasher
  ) { }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)
    const accountDb = await this.addAccountRepository.add({ ...account, password: hashedPassword })
    return accountDb
  }
}