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
    email: string;
    password: FormControl;
    confirmPassword: FormControl;
    token: string
    invalidResetPassword: boolean
    errorList: string[] = [];

    constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(p => {
            this.email = p['email']
            this.token = p['token']
        })
    }

    ngOnInit() {
        this.password = new FormControl('12345', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]);
        this.confirmPassword = new FormControl('12345', [Validators.required]);
        this.insertForm = this.fb.group({
            'password': this.password,
            'confirmPassword': this.confirmPassword,
        });
    }

    onSubmit() {
        const resetPassword = this.insertForm.value;
        this.accountService.resetPassword(this.email, resetPassword.password, resetPassword.confirmPassword, this.token).subscribe(() => {
            alert('Password reset')
            this.router.navigateByUrl('/login');
        }, error => {
            this.errorList = []
            error.error.response.forEach((element: string) => {
                this.errorList.push(element + '\n');
                console.log(element)
            })
            alert(this.errorList)
        })
    }

    get Password() {
        return this.password;
    }

}
