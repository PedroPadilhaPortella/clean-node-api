import { Router } from 'express'
import { adapteRoute } from '../adapters/express/express.route.adapter'
import { SignUpControllerFactory } from '../factories/signup/signup'
import { LoginControllerFactory } from './../factories/login/login'

export default (router: Router): void => {
  router.post('/signup', adapteRoute(SignUpControllerFactory()))
  router.post('/login', adapteRoute(LoginControllerFactory()))
}