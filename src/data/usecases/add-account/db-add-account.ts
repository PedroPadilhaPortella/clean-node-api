import { AddAccount, AddAccountRepository, CheckAccountByEmailRepository, Hasher } from "./db-add-account.protocols"

export class DbAddAccount implements AddAccount {

  constructor (
    private readonly addAccountRepository: AddAccountRepository, 
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository,
    private readonly hasher: Hasher
  ) { }

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    let hasAdded: boolean = false
    const hasAccount = await this.checkAccountByEmailRepository.checkByEmail(accountData.email)

    if (!hasAccount) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      hasAdded = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    }

    return hasAdded
  }
}