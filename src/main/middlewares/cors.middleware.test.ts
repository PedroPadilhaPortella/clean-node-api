import { Express } from 'express'
import request from 'supertest'
import { setupApp } from '../config/app'

describe('Cors Middleware', () => {
  let app: Express

  beforeAll(async () => {
    app = await setupApp()
  })

  test('should enable CORS', async () => {
    app.get('/cors_test', (req, res) => {
      res.end()
    })

    await request(app)
      .get('/cors_test')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-method', '*')
      .expect('access-control-allow-headers', '*')
  })
})