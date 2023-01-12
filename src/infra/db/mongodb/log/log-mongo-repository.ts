import { LogErrorRepository } from "@/data/protocols/log-error-repository.interface"
import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo.helper"

export class LogMongoRepository implements LogErrorRepository {

  async logError (stackError: string): Promise<void> {
    const errorCollection = MongoHelper.getCollection(CollectionsEnum.ERRORS)
    await errorCollection.insertOne({ stack: stackError, date: new Date() })
  }
}