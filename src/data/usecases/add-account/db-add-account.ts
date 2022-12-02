import { AccountModel } from "../../../domain/models/account"
import { AddAccount, AddAccountModel } from "../../../domain/usecases/add-account"
import { Encrypter } from "../../protocols/encrypter"

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    const accountModel: AccountModel = { password: hashedPassword, name: account.name, email: account.email, id: '1' }
    return await new Promise(resolve => resolve(accountModel))
  }
}