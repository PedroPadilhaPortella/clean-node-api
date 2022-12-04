import request from 'supertest'
import app from '../config/app'

describe('SignUpRoutes', () => {

  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'pedro',
        email: 'pedro@gmail.com',
        password: 'pedro123',
        passwordConfirmation: 'pedro123'
      })
      .expect(200)
  })
})