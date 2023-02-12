import { adapteResolver } from './../../adapters/apollo-server.resolver.adapter'
import { LoginControllerFactory } from "@/main/factories/controllers/login/login"
import { SignUpControllerFactory } from '@/main/factories/controllers/signup/signup'

export default {
  Query: {
    async login (parent: any, args: any) {
      const loginController = LoginControllerFactory()
      return await adapteResolver(loginController, args)
    }
  },
  Mutation: {
    async signUp (parent: any, args: any) {
      const signUpController = SignUpControllerFactory()
      return await adapteResolver(signUpController, args)
    }
  }
}