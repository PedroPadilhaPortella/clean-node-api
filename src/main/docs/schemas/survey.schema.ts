export const SurveysSchema = {
  type: 'array',
  items: {
    $ref: '#/schemas/Survey'
  }
}

export const SurveySchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    question: { type: 'string' },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/SurveyAnswer'
      }
    },
    date: { type: 'string' }
  }
}

export const SurveyAnswerSchema = {
  type: 'object',
  properties: {
    answer: {
      type: 'string'
    },
    image: {
      type: 'string'
    }
  }
}

export const AddSurveyParamsSchema = {
  type: 'object',
  properties: {
    question: { type: 'string' },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/SurveyAnswer'
      }
    }
  }
}