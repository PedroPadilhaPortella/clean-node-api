import { AccountModel } from "../models/account.model"

export interface LoadAccountByToken {
  load: (token: string, role?: string) => Promise<AccountModel | null>
}
