export interface AuthenticationModel {
  email: string
  password: string
}

// TODO: convert to Promise<string | null>
export interface Authentication {
  authenticate: (authentication: AuthenticationModel) => Promise<string | null>
}