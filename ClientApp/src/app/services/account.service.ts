import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import * as jwtDecode from 'jwt-decode'

@Injectable({ providedIn: 'root' })

export class AccountService {

    private baseUrlRegister = '/api/account/register'
    private baseUrlLogin = '/api/account/login'

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

    login(username: string, password: string) {
        return this.http.post<any>(this.baseUrlLogin, { username, password }).pipe(map(result => {
            if (result && result.token) {
                this.setLoginStatus(true)
                this.setLocalStorage(result)
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
    }

    private setLocalStorage(result: { token: string; username: string; expiration: string; role: string }) {
        localStorage.setItem('loginStatus', '1')
        localStorage.setItem('jwt', result.token)
        localStorage.setItem('username', result.username)
        localStorage.setItem('expiration', result.expiration)
        localStorage.setItem('userRole', result.role)

    }

    private setUserData() {
        this.username.next(localStorage.getItem('username'))
        this.userRole.next(localStorage.getItem('userRole'))

    }

    private navigateHome() {
        this.router.navigate(['/'])
    }

    private checkLoginStatus(): boolean {

        const token = localStorage.getItem('jwt')

        if (token == null) { return false }

        const decoded = jwtDecode(token)
        const loginCookie = localStorage.getItem('loginStatus')

        if (loginCookie === '1') {

            if (decoded['exp'] === undefined) { return false }

            const now = Date.now();
            const tokenExpDate = decoded['exp'] * 1000

            if (tokenExpDate > now) { return true }

        }

        return false

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
