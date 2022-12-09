export class InternalServerError extends Error {
  
  constructor (stack: string) {
    super(stack)
    this.name = 'InternalServerError'
    this.stack = stack
  }
}