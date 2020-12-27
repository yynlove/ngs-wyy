import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/internal/operators";

@Injectable()
export class CommonInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
    return next.handle(req.clone({
      //跨域请求是否提供凭据信息(cookie、HTTP认证及客户端SSL证明等)也可以简单的理解为，当前请求为跨域类型时是否在请求中协带cookie。
      withCredentials:true
    })).pipe(catchError(this.handleError));
  }


  /**
   *
   * @param error 返回错误信息
   */
  handleError(error: HttpErrorResponse): never {
    throw error.error;
  }
}
