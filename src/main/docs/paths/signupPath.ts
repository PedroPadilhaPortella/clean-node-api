export const signUpPath = {
  post: {
    tags: ['Login'],
    summary: 'Cadastrar conta de Usuário',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/SignUp'
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
      },
      400: {
        $ref: '#/components/badRequest'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}