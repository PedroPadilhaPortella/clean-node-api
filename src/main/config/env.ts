export default {
  port: process.env.PORT ?? 5000,
  jwtSecret: process.env.JWT_SECRET ?? 'cle@nNodeApi1',
  salt: 12,
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-node-api',
  mongoUrlTest: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-node-api-test'
}