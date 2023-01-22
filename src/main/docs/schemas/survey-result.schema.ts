export const SaveSurveyResultParamsSchema = {
  type: 'object',
  properties: {
    answer: { type: 'string' }
  }
}

export const SaveSurveyResultSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    surveyId: { type: 'string' },
    answer: { type: 'string' },
    date: { type: 'string' }
  }
}