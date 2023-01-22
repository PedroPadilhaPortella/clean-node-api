export const serverError = {
  description: 'Problema interno do sistema',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/Error'
      }
    }
  }
}