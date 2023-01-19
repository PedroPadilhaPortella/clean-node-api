import { AccountModel } from "@/domain/models/account.model"

export type AddAccountParams = Omit<AccountModel, 'id'>

export interface AddAccount {
  add: (account: AddAccountParams) => Promise<AccountModel | null>
}
