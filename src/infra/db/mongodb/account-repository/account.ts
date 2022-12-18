import { AddAccountRepository } from '../../../../data/protocols/add-account-repository.interface'
import { AccountModel } from '../../../../domain/models/account.model'
import { AddAccountModel } from '../../../../domain/usecases/add-account.interface'
import { MongoHelper } from '../helpers/mongo.helper'
import { LoadAccountByEmailRepository } from './../../../../data/protocols/load-account-repository.interface'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(account)
    return { id: result.insertedId.toJSON(), ...account }
  }
  
  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })

    if (account) {
      return { 
        id: account._id.toString(),
        email: account.email,
        name: account.name,
        password: account.password
      }
    }
    return null
  }
}