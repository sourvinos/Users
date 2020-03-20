import { ProductService } from './../products/product.service';
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
    userName: Observable<string>;

    constructor(private accountService: AccountService, private productService: ProductService) {
        this.loginStatus = this.accountService.isLoggedIn;
        this.userName = this.accountService.currentUsername;
    }

    isExpanded = false;

    collapse() {
        this.isExpanded = false;
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
    }

    logout() {
        this.productService.clearCache();
        this.accountService.logout();
    }

}
