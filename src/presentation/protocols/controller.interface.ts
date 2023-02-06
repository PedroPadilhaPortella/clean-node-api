import { HttpResponse } from "./http.interface"

export interface Controller<T = any> {
  handle: (request: T) => Promise<HttpResponse>
}