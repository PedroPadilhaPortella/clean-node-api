export const SurveyResultSchema = {
  type: 'object',
  properties: {
    surveyId: { type: 'string' },
    question: { type: 'string' },
    answers: { 
      type: 'array',
      items: {
        $ref: '#/schemas/SurveyResultAnswer'
      }
    },
    date: { type: 'string' }
  }
}

export const SurveyResultAnswerSchema = {
  type: 'object',
  properties: {
    answer: { type: 'string' },
    image: { type: 'string' },
    count: { type: 'number' },
    percent: { type: 'number' }
  }
}

export const SaveSurveyResultParamsSchema = {
  type: 'object',
  properties: {
    answer: { type: 'string' }
  }
}
