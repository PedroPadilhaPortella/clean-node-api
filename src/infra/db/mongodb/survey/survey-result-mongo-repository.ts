import { SaveSurveyResultRepository } from '@/data/protocols/save-survey-result.repository'
import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/save-survey-result.interface'
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo.helper"
import { ObjectId } from 'mongodb'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = MongoHelper.getCollection(CollectionsEnum.SURVEY_RESULTS)
    const { accountId, surveyId, answer, date } = data

    await surveyResultCollection.findOneAndUpdate(
      { accountId: new ObjectId(accountId), surveyId: new ObjectId(surveyId) },
      { $set: { answer, date } },
      { upsert: true }
    )

    const surveyResult = await this.loadBySurveyId(data.surveyId)
    return surveyResult
  }

  async loadBySurveyId (surveyId: string | ObjectId): Promise<SurveyResultModel> {
    const surveyResultCollection = MongoHelper.getCollection(CollectionsEnum.SURVEY_RESULTS)
    const query = surveyResultCollection.aggregate([
      {
        $match: {
          surveyId: new ObjectId(surveyId)
        }
      },
      {
        $group: {
          _id: 0,
          data: {
            $push: "$$ROOT"
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $unwind: {
          path: "$data"
        }
      },
      {
        $lookup: {
          from: "surveys",
          localField: "data.surveyId",
          foreignField: "_id",
          as: "survey"
        }
      },
      {
        $unwind: {
          path: "$survey"
        }
      },
      {
        $group: {
          _id: {
            surveyId: "$survey._id",
            question: "$survey.question",
            date: "$survey.date",
            total: "$count",
            answer: {
              $filter: {
                input: "$survey.answers",
                as: "item",
                cond: {
                  $eq: ["$$item.answer", "$data.answer"]
                }
              }
            }
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $unwind: {
          path: "$_id.answer"
        }
      },
      {
        $addFields: {
          "_id.answer.count": "$count",
          "_id.answer.percent": {
            $floor: [
              {
                $multiply: [
                  { $divide: ["$count", "$_id.total"] },
                  100
                ]
              }
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            surveyId: "$_id.surveyId",
            question: "$_id.question",
            date: "$_id.date"
          },
          answers: {
            $push: "$_id.answer"
          }
        }
      },
      {
        $project: {
          _id: 0,
          surveyId: "$_id.surveyId",
          question: "$_id.question",
          date: "$_id.date",
          answers: "$answers"
        }
      }
    ])

    const surveyResult = await query.toArray()
    return surveyResult.length ? surveyResult[0] as SurveyResultModel : null
  }
}