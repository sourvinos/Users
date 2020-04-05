import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {

    insertForm: FormGroup;
    username: FormControl;
    displayName: FormControl
    password: FormControl;
    confirmPassword: FormControl;
    email: FormControl;
    invalidRegister: boolean
    errorList: string[] = [];

    constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) { }

    ngOnInit() {
        this.username = new FormControl('', [Validators.required, Validators.maxLength(10)]);
        this.displayName = new FormControl('', [Validators.required]);
        this.password = new FormControl('12345', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]);
        this.confirmPassword = new FormControl('12345', [Validators.required]);
        this.email = new FormControl('', [Validators.required]);
        this.insertForm = this.fb.group({
            'username': this.username,
            'displayName': this.displayName,
            'password': this.password,
            'confirmPassword': this.confirmPassword,
            'email': this.email
        });
    }

    register() {
        const userRegister = this.insertForm.value;
        this.accountService.register(userRegister.username, userRegister.displayName, userRegister.password, userRegister.confirmPassword, userRegister.email).subscribe((result) => {
            alert(`An email was sent to ${userRegister.email} for account verification`)
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
        return this.username;
    }

    get Password() {
        return this.password;
    }

    get Email() {
        return this.email;
    }

}
