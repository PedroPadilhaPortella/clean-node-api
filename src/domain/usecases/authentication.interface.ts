import { AuthenticationModel } from "../models/authentication.model"

export type AuthenticationParams = {
  email: string
  password: string
}

export interface Authentication {
  authenticate: (authentication: AuthenticationParams) => Promise<AuthenticationModel>
}