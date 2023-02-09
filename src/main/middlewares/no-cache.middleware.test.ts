import { Express } from 'express'
import request from 'supertest'
import { setupApp } from '../config/app'
import { noCache } from './no-cache.middleware'

describe('NoCache Middleware', () => {
  let app: Express

  beforeAll(async () => {
    app = await setupApp()
  })

  test('should disable cache', async () => {
    app.get('/test_no_cache', noCache, (req, res) => {
      res.end()
    })

    await request(app)
      .get('/test_no_cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})