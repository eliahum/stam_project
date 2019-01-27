import { Column } from 'primeng/primeng';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest,
  HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http'
import { Observable } from 'rxjs/internal/Observable';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'
import 'rxjs-compat/add/observable/throw'
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';




@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private messageService: MessageService, private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    req = req.clone({ withCredentials: true });



    //req.params =req.params.append('myfilter2', 'completed'); 
    //let authToken = localStorage.getItem('token');
    //authToken = 'Bearer ' + authToken
    return next.handle(req).do(() => { }, (response) => {
      if (response instanceof HttpErrorResponse) {
        if (response.status === 401) {
          return;
        }

        else if (response.status === 400 &&
          response.error) {
          //this.errorService.addErrors(Array.isArray(response.error) ? response.error : [response.error]);
          return;
        }
        else if (response.status === 412 &&
          response.error) {
          this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: response.error });
          return;
        }
        else if (response.status === 503 &&
          response.error) {

          this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: 'חלה שגיאה בהתחברות לשרת' });

          //this.errorService.addErrors(Array.isArray(response.error) ? response.error : [response.error]);
          return;
        }
        else {
          if (!response.ok)
            this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: response.message });

        }
        //        alert(response.status);
        //            this.errorService.addErrors([`Your generic error message`]);
      }

      return Observable.throw(response);
    });

    //.catch(this.handleError);
  }
  private handleError(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}
