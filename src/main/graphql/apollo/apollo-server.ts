import resolvers from '../resolvers'
import typeDefs from '../type-defs'

import { ApolloServer } from 'apollo-server-express'

export const setupApolloServer = (): ApolloServer => new ApolloServer({
  resolvers, 
  typeDefs
})
