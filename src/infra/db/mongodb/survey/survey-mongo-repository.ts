import { AddSurveyRepository } from '../../../../data/protocols/add-survey-repository.interface'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey.interface'
import { MongoHelper } from '../helpers/mongo.helper'
import { CollectionsEnum } from './../../../../domain/enums/collections.enum'

export class SurveyMongoRepository implements AddSurveyRepository {
  
  async add (survey: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEYS)
    await surveyCollection.insertOne(survey)
  }
}