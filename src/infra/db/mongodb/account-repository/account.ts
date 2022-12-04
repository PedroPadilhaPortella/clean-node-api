import { AccountModel } from '../../../../domain/models/account.model'
import { AddAccountModel } from '../../../../domain/usecases/add-account.interface'
import { AddAccountRepository } from '../../../../data/protocols/add-account-repository.interface'
import { MongoHelper } from "../helpers/mongo.helper"

export class AccountMongoRepository implements AddAccountRepository {

  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(account)
    return { id: result.insertedId.toJSON(), ...account }
  }
}