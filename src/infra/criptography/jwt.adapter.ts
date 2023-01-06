import { Decrypter } from './../../data/protocols/decrypter.interface'
import { Encrypter } from '../../data/protocols/encrypter.interface'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {

  constructor (private readonly jwtSecret: string) { }
  
  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.jwtSecret)
  }
  
  async decrypt (token: string): Promise<string> {
    const result: any = jwt.verify(token, this.jwtSecret)
    return result
  }
}