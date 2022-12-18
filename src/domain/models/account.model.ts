import { ObjectId } from "mongodb"

export interface AccountModel {
  id: ObjectId | string
  name: string
  email: string
  password: string
}