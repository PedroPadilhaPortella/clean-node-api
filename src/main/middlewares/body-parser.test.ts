import request from 'supertest'
import app from '../config/app'

describe('BodyParser Middleware', () => {

  test('should parse body as json', async () => {
    app.post('/body_parser_test', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/body_parser_test')
      .send({ name: 'pedro' })
      .expect({ name: 'pedro' })
  })
})