import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class AccountService {

    private baseUrlRegister = '/api/account/register';
    private baseUrlLogin = '/api/account/login';

    private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
    private username = new BehaviorSubject<string>(localStorage.getItem('username'));
    private userRole = new BehaviorSubject<string>(localStorage.getItem('password'));

    constructor(private http: HttpClient, private router: Router) { }

    register(username: string, password: string, email: string) {
        return this.http.post<any>(this.baseUrlRegister, { username, password, email }).pipe(map(result => {
            return result;
        }, (error: any) => {
            return error;
        }));
    }

    login(username: string, password: string) {
        return this.http.post<any>(this.baseUrlLogin, { username, password }).pipe(map(result => {
            if (result && result.token) {
                this.loginStatus.next(true);
                localStorage.setItem('loginStatus', '1');
                localStorage.setItem('jwt', result.token);
                localStorage.setItem('username', result.username);
                localStorage.setItem('expiration', result.expiration);
                localStorage.setItem('userRole', result.userRole);
            }
        }));
    }

    logout() {
        localStorage.setItem('loginStatus', '0');
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userRole');
        this.loginStatus.next(false);
        this.router.navigate(['/']);
    }

    checkLoginStatus() {
        return false;
    }

    get isLoggedIn() {
        return this.loginStatus.asObservable();
    }

    get currentUsername() {
        return this.username.asObservable();
    }

    get currentUserRole() {
        return this.userRole.asObservable();
    }

}
