import { AddAccount } from "../usecases/add-account/db-add-account.protocols"

export interface AddAccountRepository {
  add: (account: AddAccountRepository.Params) => Promise<AddAccountRepository.Result>
}

export namespace AddAccountRepository {
  export type Params = AddAccount.Params
  export type Result = boolean
}