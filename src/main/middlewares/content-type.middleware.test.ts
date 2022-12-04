import request from 'supertest'
import app from '../config/app'

describe('ContentType Middleware', () => {

  test('should return application/json as default content-type', async () => {
    app.get('/content_type_json_test', (req, res) => {
      res.send()
    })

    await request(app)
      .get('/content_type_json_test')
      .expect('content-type', /json/)
  })

  test('should return application/xml when forced', async () => {
    app.get('/content_type_xml_test', (req, res) => {
      res.type('xml')
      res.send()
    })

    await request(app)
      .get('/content_type_xml_test')
      .expect('content-type', /xml/)
  })
})