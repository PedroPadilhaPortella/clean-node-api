import { AccountModel } from "@/domain/models/account.model"
import { AddAccountModel } from "@/domain/usecases/add-account.interface"

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}