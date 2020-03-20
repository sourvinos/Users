import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AccountService } from 'src/app/services/account.service'

export interface CanComponentDeactivate {
    confirm(): boolean
}

@Injectable({ providedIn: 'root' })

export class AuthGuardService implements CanActivate {

    constructor(private accountService: AccountService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.accountService.isLoggedIn.pipe(map((loginStatus: boolean) => {
            if (!loginStatus) {
                this.router.navigate(['/login'])
                return false
            }
            return true
        }))
    }

}
