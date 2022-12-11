import { SignUpControllerFactory } from './../factories/signup'
import { Router } from 'express'
import { adapteRoute } from '../adapters/express.route.adapter'

export default (router: Router): void => {
  router.post('/signup', adapteRoute(SignUpControllerFactory()))
}