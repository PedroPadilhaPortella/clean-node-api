export const signupPath = {
  post: {
    tags: ['SignUp'],
    summary: 'Cadastrar Usuário',
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
      401: {
        $ref: '#/components/unauthorized'
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