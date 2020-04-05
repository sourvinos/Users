import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { PasswordValidator } from './password-validator';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {

    form: FormGroup;
    invalidRegister: boolean
    errorList: string[] = [];

    constructor(private formBuilder: FormBuilder, private accountService: AccountService, private router: Router) { }

    ngOnInit() {
        this.initForm()
    }

    initForm() {
        this.form = this.formBuilder.group({
            username: ['', [Validators.required, Validators.maxLength(32)]],
            displayName: ['', [Validators.required, Validators.maxLength(32)]],
            email: ['', [Validators.required, Validators.maxLength(32), Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
            password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(128)]],
            confirmPassword: ['', [Validators.required]],
        }, { validator: PasswordValidator })
    }

    register() {
        if (!this.form.valid) {
            console.log('Invalid form')
            return
        }
        const form = this.form.value;
        this.accountService.register(form.username, form.displayName, form.password, form.confirmPassword, form.email).subscribe(() => {
            alert(`An email was sent to ${form.email} for account verification`)
            this.invalidRegister = false
            this.router.navigateByUrl('/login');
        }, error => {
            this.invalidRegister = true
            this.errorList = []
            error.error.response.forEach((element: string) => {
                this.errorList.push(element + '\n');
                console.log(element)
            });
            console.log(this.errorList)
            alert(this.errorList)
        });
    }

    get Username() {
        return this.form.get('username');
    }

    get DisplayName() {
        return this.form.get('displayName');
    }

    get Password() {
        return this.form.get('password');
    }

    get ConfirmPassword() {
        return this.form.get('confirmPassword')
    }

    get Email() {
        return this.form.get('email');
    }

}
