import { SaveSurveyResultRepository } from '@/data/protocols/save-survey-result.repository'
import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result.interface'
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo.helper"

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEY_RESULTS)
    const { value: survey } = await surveyCollection.findOneAndUpdate(
      { surveyId: data.surveyId, accountId: data.accountId }, 
      { $set: { answer: data.answer, date: data.date } },
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