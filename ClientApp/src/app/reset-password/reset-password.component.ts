import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {

    insertForm: FormGroup;
    email: FormControl;
    password: FormControl;
    cpassword: FormControl;
    token: FormControl
    invalidResetPassword: boolean
    errorList: string[] = [];

    constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(p => {
            this.email = p['email']
            this.token = p['tokenEncoded']
        })
    }

    ngOnInit() {
        this.password = new FormControl('12345', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]);
        this.cpassword = new FormControl('12345', [Validators.required]);
        this.insertForm = this.fb.group({
            'password': this.password,
            'cpassword': this.cpassword,
        });
    }

    resetPassword() {
        const resetPassword = this.insertForm.value;
        this.accountService.resetPassword(resetPassword.email, resetPassword.password, resetPassword.cpassword, resetPassword.token).subscribe((result) => {
            console.log(result)
            this.invalidResetPassword = false
            this.router.navigateByUrl('/login');
        }, error => {
            this.invalidResetPassword = true
            error.error.value.forEach((element: string) => {
                this.errorList.push(element);
            });
        });
    }

    get Password() {
        return this.password;
    }

}
