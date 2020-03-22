import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import * as jwtDecode from 'jwt-decode'

@Injectable({ providedIn: 'root' })

export class AccountService {

    private baseUrlRegister = '/api/account/register'
    private baseUrlLogin = '/api/account/login'
    private baseUrlToken = '/api/token/auth'

    private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus())
    private username = new BehaviorSubject<string>(localStorage.getItem('username'))
    private userRole = new BehaviorSubject<string>(localStorage.getItem('userRole'))

    constructor(private http: HttpClient, private router: Router) { }

    register(username: string, password: string, email: string) {
        return this.http.post<any>(this.baseUrlRegister, { username, password, email }).pipe(map(result => {
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
                    localStorage.setItem('username', result.authToken.userName)
                    localStorage.setItem('displayName', result.authToken.displayName)
                    localStorage.setItem('expiration', result.authToken.expiration)
                    localStorage.setItem('userRole', result.authToken.roles)
                    localStorage.setItem('refreshToken', result.authToken.refresh_token)
                }
                return <any>result
            })
        )
    }

    login(username: string, password: string) {
        const grantType = 'password'
        return this.http.post<any>(this.baseUrlToken, { username, password, grantType }).pipe(map(result => {
            if (result && result.authToken.token) {
                this.setLoginStatus(true)
                localStorage.setItem('loginStatus', '1')
                localStorage.setItem('jwt', result.authToken.token)
                localStorage.setItem('username', result.authToken.username)
                localStorage.setItem('expiration', result.authToken.expiration)
                localStorage.setItem('userRole', result.authToken.roles)
                localStorage.setItem('refreshToken', result.authToken.refresh_token)
                this.setUserData()
            }
        }))
    }

    logout() {
        this.clearLocalStorage()
        this.setLoginStatus(false)
        this.navigateHome()
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

    private setLocalStorage(result: { token: string; username: string; expiration: string; role: string }) {

    }

    private setUserData() {
        this.username.next(localStorage.getItem('username'))
        this.userRole.next(localStorage.getItem('userRole'))
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
