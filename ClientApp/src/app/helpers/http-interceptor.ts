import { HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, switchMap, finalize, filter, take } from 'rxjs/operators';
import { AccountService } from './../services/account.service';

@Injectable({ providedIn: 'root' })

// Gets the token from localstorage and attaches it to the request
// In app.module it is added in the providers array and in every feature module
export class HttpInterceptor implements HttpInterceptor {

    private isTokenRefreshing = false;
    private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private accountService: AccountService, private http: HttpClient) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(this.attachTokenToRequest(request)).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('Success')
                }
            }), catchError((err): Observable<any> => {
                if (err instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>err).status) {
                        case 401:
                            console.log('Token has expired. Attempting to refresh...')
                            return this.handleHttpErrorResponse(request, next)
                        case 400:
                            return <any>this.accountService.logout()
                    }
                } else {
                    return throwError(err)
                }
            }))
    }

    private handleHttpErrorResponse(request: HttpRequest<any>, next: HttpHandler) {

        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true
            this.tokenSubject.next(null)
            return this.accountService.getNewRefreshToken().pipe(
                switchMap((tokenresponse: any) => {
                    if (tokenresponse) {
                        this.tokenSubject.next(tokenresponse.authToken.token)
                        localStorage.setItem('loginStatus', '1')
                        localStorage.setItem('jwt', tokenresponse.authToken.token)
                        localStorage.setItem('username', tokenresponse.authToken.userName)
                        localStorage.setItem('displayName', tokenresponse.authToken.displayName)
                        localStorage.setItem('expiration', tokenresponse.authToken.expiration)
                        localStorage.setItem('userRole', tokenresponse.authToken.roles)
                        localStorage.setItem('refreshToken', tokenresponse.authToken.refresh_token)
                        console.log('Token refreshed...')
                        return next.handle(this.attachTokenToRequest(request))
                    }
                    return <any>this.accountService.logout()
                }),
                catchError(err => {
                    this.accountService.logout()
                    return this.handleError(err)
                }),
                finalize(() => {
                    this.isTokenRefreshing = false
                })
            )
        } else {
            this.isTokenRefreshing = false
            return this.tokenSubject.pipe(filter(token => token != null), take(1), switchMap((token) => next.handle(this.attachTokenToRequest(request))))
        }
    }

    private attachTokenToRequest(request: HttpRequest<any>) {

        const token = localStorage.getItem('jwt');

        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })

    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMsg: string
        if (errorResponse.error instanceof Error) {
            errorMsg = 'An error occured :' + errorResponse.error.message
        } else {
            errorMsg = `Backend returned code ${errorResponse.status}, body was: ${errorResponse.error}`
        }
        return throwError(errorMsg)
    }

}
