import { SaveSurveyResultRepository } from '@/data/protocols/save-survey-result.repository'
import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result.interface'
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo.helper"
import { ObjectId } from 'mongodb'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = MongoHelper.getCollection(CollectionsEnum.SURVEY_RESULTS)
    const { accountId, surveyId, answer, date } = data
    
    const { value: survey } = await surveyResultCollection.findOneAndUpdate(
      { accountId: new ObjectId(accountId), surveyId: new ObjectId(surveyId) }, 
      { $set: { answer, date } },
      { upsert: true, returnDocument: 'after' }
    )

    return { 
      id: survey._id.toString(),
      accountId: survey.accountId,
      surveyId: survey.surveyId,
      answer: survey.answer,
      date: survey.date
    }
  }
}