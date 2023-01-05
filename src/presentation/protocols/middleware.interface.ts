import { HttpRequest, HttpResponse } from "./http.interface"

export interface Middleware {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}