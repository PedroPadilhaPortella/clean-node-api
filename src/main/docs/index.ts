import { badRequest, forbidden, notFound, serverError, unauthorized } from './components'
import { loginPath, signUpPath, surveyPath } from './paths'
import { AccountSchema, ErrorSchema, LoginParamsSchema, SignUpSchema, SurveyAnswerSchema, SurveySchema, SurveysSchema, ApiKeyAuthSchema, AddSurveyParamsSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API de enquetes entre programadores',
    version: '2.2.1'
  },
  contact: {
    name: 'Pedro Padilha Portella',
    url: 'https://www.linkedin.com/in/pedro-padilha-portella-02a67318a/'
  },
  servers: [
    { url: '/api' }
  ],
  tags: [
    { name: 'Login' },
    { name: 'Enquete' }
  ],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath

  },
  schemas: {
    Account: AccountSchema,
    SignUp: SignUpSchema,
    Login: LoginParamsSchema,
    Surveys: SurveysSchema,
    Survey: SurveySchema,
    SurveyAnswer: SurveyAnswerSchema,
    AddSurvey: AddSurveyParamsSchema,
    Error: ErrorSchema
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: ApiKeyAuthSchema
    },
    badRequest,
    unauthorized,
    serverError,
    notFound,
    forbidden
  }
}