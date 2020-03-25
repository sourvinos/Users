import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from './../services/account.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

    insertForm: FormGroup;
    username: FormControl;
    password: FormControl;
    returnUrl: string;
    errorMessage: string;
    invalidLogin: boolean;

    constructor(
        private accountService: AccountService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.username = new FormControl('sourvinos', [Validators.required]);
        this.password = new FormControl('12345', [Validators.required, Validators.maxLength(50)]);
        this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/home';
        this.insertForm = this.fb.group({
            'username': this.username,
            'password': this.password
        });
    }

    login() {
        const userLogin = this.insertForm.value;
        this.accountService.login(userLogin.username, userLogin.password).subscribe(result => {
            // const token = (<any>result).authToken.tokenE
            // console.log(token)
            // console.log(token.authToken.roles)
            console.log('User logged in successfully')
            this.invalidLogin = false;
            this.router.navigateByUrl(this.returnUrl);
        }, error => {
            this.invalidLogin = true;
            this.errorMessage = error.error;
            console.log(this.errorMessage);
        });
    }

    register() {
        this.router.navigate(['/register']);
    }

}
