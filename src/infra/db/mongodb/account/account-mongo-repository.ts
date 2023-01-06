import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/add-account-repository.interface'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/load-account-by-email-repository.interface'
import { LoadAccountByTokenRepository } from '../../../../data/protocols/load-account-by-token-repository.interface'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/update-access-token-repository.interface'
import { AccountModel } from '../../../../domain/models/account.model'
import { AddAccountModel } from '../../../../domain/usecases/add-account.interface'
import { MongoHelper } from '../helpers/mongo.helper'
import { CollectionsEnum } from './../../../../domain/enums/collections.enum'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository {
  
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection(CollectionsEnum.ACCOUNTS)
    const result = await accountCollection.insertOne(account)
    return { id: result.insertedId, ...account }
  }
  
  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = MongoHelper.getCollection(CollectionsEnum.ACCOUNTS)
    const result = await accountCollection.findOne({ email })

    if (result) {
      return { 
        id: result._id,
        email: result.email,
        name: result.name,
        password: result.password
      }
    }
    return null
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection(CollectionsEnum.ACCOUNTS)
    const result = await accountCollection.findOne({ accessToken: token, role })

    if (result) {
      return { 
        id: result._id,
        email: result.email,
        name: result.name,
        password: result.password
      }
    }
    return null 
  }

  async updateToken (id: ObjectId, token: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection(CollectionsEnum.ACCOUNTS)
    await accountCollection.updateOne(
      { _id: id }, { 
        $set: { 
          accessToken: token 
        } 
      }
    )
  }
}