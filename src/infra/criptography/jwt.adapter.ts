import { Encrypter } from '../../data/protocols/encrypter.interface'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {

  constructor (private readonly jwtSecret: string) { }
  
  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.jwtSecret)
  }
}