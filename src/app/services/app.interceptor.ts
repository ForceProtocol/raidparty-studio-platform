import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).do((event: HttpEvent<any>) => { return event; }, (err: any) => {
      if ((err.status >= 500 && err.status < 600) || err.status <= 0) {
        return err.error = {
          err: "There is some error on server, Please try again later",
          err_code: "Server Error"
        }
      } else if (err.status == 404) {
        return err.error = {
          err: "The page you requested is not found on the server",
          err_code: "Not Found"
        }
      }
    });
  }
}