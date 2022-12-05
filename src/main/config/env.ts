export default {
  port: process.env.PORT ?? 5050,
  mongoUrl: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/clean-node-api',
  mongoUrlTest: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/clean-node-api-test'
}