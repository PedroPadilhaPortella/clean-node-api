import { Express } from 'express'
import request from 'supertest'
import { setupApp } from '../config/app'

describe('BodyParser Middleware', () => {
  let app: Express

  test('should parse body as json', async () => {
    app = await setupApp()
    app.post('/body_parser_test', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/body_parser_test')
      .send({ name: 'pedro' })
      .expect({ name: 'pedro' })
  })
})