import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from './../services/account.service';

@Injectable({ providedIn: 'root' })

// Gets the token from localstorage and attaches it to the request
// In app.module it is added in the providers array and in every feature module
export class HttpInterceptor implements HttpInterceptor {

    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const isLoggedIn = this.accountService.isLoggedIn;
        const token = localStorage.getItem('jwt');

        if (isLoggedIn && token !== undefined) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request);

    }

}
