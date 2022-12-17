import bcrypt from 'bcrypt'
import { Hasher } from "../../data/protocols/hasher.interface"

export class BCryptAdapter implements Hasher {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}