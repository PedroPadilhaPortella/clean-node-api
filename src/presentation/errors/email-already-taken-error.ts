export class EmailAlreadyTaken extends Error {
  
  constructor () {
    super('Email already taken')
    this.name = 'Email already taken'
  }
}