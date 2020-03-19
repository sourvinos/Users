import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})

export class HomeComponent {

    userName: Observable<string>;

    constructor(private accountService: AccountService) {
        this.userName = this.accountService.currentUsername;
    }

}
