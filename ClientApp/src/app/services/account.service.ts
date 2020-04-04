import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })

export class AccountService {

    private baseUrlRegister = '/api/account/register'
    private baseUrlForgotPassword = '/api/account/forgotPassword'
    private baseUrlResetPassword = '/api/account/resetPassword'
    private baseUrlToken = '/api/token/auth'

    private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus())
    private username = new BehaviorSubject<string>(localStorage.getItem('username'))
    private userRole = new BehaviorSubject<string>(localStorage.getItem('userRole'))

    constructor(private http: HttpClient, private router: Router) { }

    register(username: string, displayName: string, password: string, email: string) {
        return this.http.post<any>(this.baseUrlRegister, { username, displayName, password, email })
    }

    login(username: string, password: string) {
        const grantType = 'password'
        return this.http.post<any>(this.baseUrlToken, { username, password, grantType }).pipe(map(response => {
            this.setLoginStatus(true)
            this.setLocalStorage(response)
            this.setUserData()
            // return response
        }))
    }

    logout() {
        this.clearLocalStorage()
        this.setLoginStatus(false)
        this.navigateHome()
    }

    forgotPassword(email: string) {
        return this.http.post<any>(this.baseUrlForgotPassword, { email }).pipe(map(result => {
            return result
        }, (error: any) => {
            return error
        }))
    }

    resetPassword(email: string, password: string, cpassword: string, token: string) {
        return this.http.post<any>(this.baseUrlResetPassword, { email, password, cpassword, token }).pipe(map(result => {
            return result
        }, (error: any) => {
            return error
        }))
    }

    getNewRefreshToken(): Observable<any> {
        const userName = localStorage.getItem('username')
        const refreshToken = localStorage.getItem('refreshToken')
        const grantType = 'refresh_token'
        return this.http.post<any>(this.baseUrlToken, { userName, refreshToken, grantType }).pipe(
            map(result => {
                if (result && result.authToken.token) {
                    this.loginStatus.next(true)
                    localStorage.setItem('loginStatus', '1')
                    localStorage.setItem('jwt', result.authToken.token)
                    localStorage.setItem('username', result.authToken.username)
                    localStorage.setItem('displayName', result.authToken.displayName)
                    localStorage.setItem('expiration', result.authToken.expiration)
                    localStorage.setItem('userRole', result.authToken.roles)
                    localStorage.setItem('refreshToken', result.authToken.refresh_token)
                    return result
                }
            })
        )
    }

    clearLocalStorage() {
        localStorage.removeItem('jwt')
        localStorage.removeItem('userRole')
        localStorage.removeItem('username')
        localStorage.removeItem('expiration')
        localStorage.removeItem('loginStatus')
        localStorage.removeItem('displayName')
        localStorage.removeItem('refreshToken')
    }
    private setLocalStorage(response: any) {
        localStorage.setItem('loginStatus', '1')
        localStorage.setItem('jwt', response.response.token)
        localStorage.setItem('username', response.response.username)
        localStorage.setItem('expiration', response.response.expiration)
        localStorage.setItem('userRole', response.response.roles)
        localStorage.setItem('refreshToken', response.response.refresh_token)
    }

    private setUserData() {
        this.username.next(localStorage.getItem('username'));
        this.userRole.next(localStorage.getItem('userRole'));
    }

    private navigateHome() {
        this.router.navigate(['/'])
    }

    private checkLoginStatus(): boolean {

        const loginCookie = localStorage.getItem('loginStatus')

        if (loginCookie === '1') {
            if (localStorage.getItem('jwt') !== null || localStorage.getItem('jwt') !== undefined) {
                return true
            }
        }

    }

    private setLoginStatus(status: boolean) {
        this.loginStatus.next(status)
    }

    get isLoggedIn() {
        return this.loginStatus.asObservable()
    }

    get currentUsername() {
        return this.username.asObservable()
    }

    get currentUserRole() {
        return this.userRole.asObservable()
    }

}
