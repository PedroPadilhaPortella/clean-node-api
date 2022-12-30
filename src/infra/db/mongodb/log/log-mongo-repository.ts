import { LogErrorRepository } from "../../../../data/protocols/log-error-repository.interface"
import { MongoHelper } from "../helpers/mongo.helper"
import { CollectionsEnum } from './../../../../domain/enums/collections.enum'

export class LogMongoRepository implements LogErrorRepository {

  async logError (stackError: string): Promise<void> {
    const errorCollection = MongoHelper.getCollection(CollectionsEnum.ERRORS)
    await errorCollection.insertOne({ stack: stackError, date: new Date() })
  }
}