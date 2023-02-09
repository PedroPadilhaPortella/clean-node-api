import 'module-alias/register'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo.helper'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(() => console.log('Connected to MongoDb'))
  .then(async () => {
    const { setupApp } = await import('./config/app')
    const app = await setupApp()
    app.listen(env.port, () => console.log(`Server Running at http://localhost:${env.port}`))
  })
  .catch((err) => console.log(err))
