import { AccountModel } from "../../domain/models/account.model"

// TODO: convert to Promise<AccountModel | null>
export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<AccountModel | null>
}