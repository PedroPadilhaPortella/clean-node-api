import { Router } from 'express'
import { adapteRoute } from '../adapters/express/express.route.adapter'
import { SignUpControllerFactory } from '../factories/controllers/signup/signup'
import { LoginControllerFactory } from './../factories/controllers/login/login'

export default (router: Router): void => {
  router.post('/signup', adapteRoute(SignUpControllerFactory()))
  router.post('/login', adapteRoute(LoginControllerFactory()))
}