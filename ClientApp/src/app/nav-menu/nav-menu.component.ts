import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.css']
})

export class NavMenuComponent {

    loginStatus: Observable<boolean>;

    constructor(private accountService: AccountService) {
        this.loginStatus = this.accountService.isLoggedIn;
    }

    isExpanded = false;

    collapse() {
        this.isExpanded = false;
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
    }

    logout() {
        this.accountService.logout();
    }

}
