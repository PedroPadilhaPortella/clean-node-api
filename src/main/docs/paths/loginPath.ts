export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'Autenticar Usuário',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/Login'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/Account'
            }
          }
        }
      }
    }
  }
}