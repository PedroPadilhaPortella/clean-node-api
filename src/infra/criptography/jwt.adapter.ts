import { Encrypter } from './../../data/protocols/encrypter'
import jwt from 'jsonwebtoken'

/**
 * TODO: Refactor: change all dependencies to EcmaScript2015
 *  constructor (private readonly jwtSecret: string) {
      this.jwtSecret = jwtSecret
    }
 */
export class JwtAdapter implements Encrypter {

  private readonly jwtSecret: string

  constructor (jwtSecret: string) {
    this.jwtSecret = jwtSecret
  }
  
  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.jwtSecret)
  }
}