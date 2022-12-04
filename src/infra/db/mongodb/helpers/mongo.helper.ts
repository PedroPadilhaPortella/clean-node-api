import { Collection, MongoClient } from "mongodb"

export const MongoHelper = {
  connection: null as unknown as MongoClient,

  async connect (): Promise<void> {
    this.connection = new MongoClient("mongodb://localhost:27017")
  },

  async disconnect (): Promise<void> {
    await this.connection.close()
  },

  getCollection (name: string): Collection {
    return this.connection.db().collection(name)
  }
}