import { HttpResponse } from "./http.interface"

export interface Middleware<T = any> {
  handle: (request: T) => Promise<HttpResponse>
}