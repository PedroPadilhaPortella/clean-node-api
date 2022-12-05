import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from "./db-add-account.protocols"

export class DbAddAccount implements AddAccount {
  private readonly addAccountRepository: AddAccountRepository
  private readonly encrypter: Encrypter

  constructor (addAccountRepository: AddAccountRepository, encrypter: Encrypter) {
    this.addAccountRepository = addAccountRepository
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    const accountDb = await this.addAccountRepository.add({ ...account, password: hashedPassword })
    return accountDb
  }
}