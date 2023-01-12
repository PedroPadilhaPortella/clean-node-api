import { ObjectId } from "mongodb"

export type AccountModel = {
  id: ObjectId | string
  name: string
  email: string
  password: string
}