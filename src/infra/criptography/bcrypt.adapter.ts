import bcrypt from 'bcrypt'
import { Hasher } from "../../data/protocols/hasher.interface"
import { HashComparer } from './../../data/protocols/hash-comparer.interface'

export class BCryptAdapter implements Hasher, HashComparer {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }
  
  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}