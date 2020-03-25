import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html'
})

export class ForgotPasswordComponent implements OnInit {

    insertForm: FormGroup;
    email: FormControl;
    invalidForgotPassword: boolean
    errorList: string[] = [];

    constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) { }

    ngOnInit() {
        this.email = new FormControl('', [Validators.required]);
        this.insertForm = this.fb.group({
            'email': this.email
        });
    }

    forgotPassword() {
        const forgotPassword = this.insertForm.value;
        this.accountService.forgotPassword(forgotPassword.email).subscribe((result) => {
            console.log(result)
            this.invalidForgotPassword = false
            this.router.navigateByUrl('/login');
        }, error => {
            this.invalidForgotPassword = true
            error.error.value.forEach((element: string) => {
                this.errorList.push(element);
            });
        });
    }

    get Email() {
        return this.email;
    }

}
