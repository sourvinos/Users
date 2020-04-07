import { HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, switchMap, finalize, filter, take } from 'rxjs/operators';
import { AccountService } from './../services/account.service';

@Injectable({ providedIn: 'root' })

export class HttpInterceptor implements HttpInterceptor {

    //#region Init
    private isTokenRefreshing = false;
    private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    //#endregion

    constructor(private accountService: AccountService, private http: HttpClient) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(this.attachTokenToRequest(request)).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('User is logged in, token is valid')
                }
            }), catchError((err): Observable<any> => {
                if (this.isUserLoggedIn()) {
                    console.log('User is logged in, catching error')
                    if (err instanceof HttpErrorResponse) {
                        switch ((<HttpErrorResponse>err).status) {
                            case 400:
                                return <any>this.accountService.logout()
                            case 401:
                                console.log('Token expired, attempting to refresh it')
                                return this.handleHttpErrorResponse(request, next)
                        }
                    } else {
                        return throwError(this.handleError)
                    }
                }
            })
        )
    }

    private handleHttpErrorResponse(request: HttpRequest<any>, next: HttpHandler) {
        console.log('User is not authorized')
        if (!this.isTokenRefreshing) {
            console.log('Token is not refreshing, continue')
            this.isTokenRefreshing = true
            this.tokenSubject.next(null)
            return this.accountService.getNewRefreshToken().pipe(
                switchMap((tokenresponse: any) => {
                    console.log('New refresh token ' + tokenresponse)
                    if (tokenresponse) {
                        this.tokenSubject.next(tokenresponse.authToken.token)
                        localStorage.setItem('loginStatus', '1')
                        localStorage.setItem('jwt', tokenresponse.authToken.token)
                        localStorage.setItem('username', tokenresponse.authToken.userName)
                        localStorage.setItem('displayName', tokenresponse.authToken.displayName)
                        localStorage.setItem('expiration', tokenresponse.authToken.expiration)
                        localStorage.setItem('userRole', tokenresponse.authToken.roles)
                        localStorage.setItem('refreshToken', tokenresponse.authToken.refresh_token)
                        console.log('Token refreshed')
                        return next.handle(this.attachTokenToRequest(request))
                    }
                    return <any>this.accountService.logout()
                }),
                catchError(error => {
                    this.accountService.logout()
                    return this.handleError(error)
                }),
                finalize(() => {
                    this.isTokenRefreshing = false
                })
            )
        } else {
            this.isTokenRefreshing = false
            return this.tokenSubject.pipe(filter(token => token != null), take(1), switchMap(() => next.handle(this.attachTokenToRequest(request))))
        }
    }

    private attachTokenToRequest(request: HttpRequest<any>) {
        const token = localStorage.getItem('jwt');
        console.log('Attaching token to request')
        console.log(token)
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

    private isUserLoggedIn() {
        return localStorage.getItem('loginStatus') === '1'
    }

}
