import { ObjectId } from "mongodb"

export interface UpdateAccessTokenRepository {
  updateToken: (id: ObjectId | string, token: string) => Promise<void>
}