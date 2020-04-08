import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from './../services/account.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

    form: FormGroup;
    returnUrl: string;

    constructor(private formBuilder: FormBuilder, private accountService: AccountService, private router: Router, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.initForm()
        this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/home';
    }

    initForm() {
        this.form = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
        })
    }

    login() {
        const form = this.form.value;
        this.accountService.login(form.username, form.password).subscribe(() => {
            this.router.navigateByUrl(this.returnUrl);
        }, error => {
            alert(error.error.response)
        });
    }

    register() {
        this.router.navigateByUrl('/register');
    }

    forgotPassword() {
        this.router.navigateByUrl('/forgotPassword');
    }

    get Username() {
        return this.form.get('username');
    }

    get Password() {
        return this.form.get('password');
    }

}
