import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
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
    password: FormControl;
    cpassword: FormControl;
    email: FormControl;
    errorList: string[];
    modalMessage: string;

    constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) { }

    ngOnInit() {
        this.username = new FormControl('', [Validators.required]);
        this.password = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]);
        this.cpassword = new FormControl('', [Validators.required]);
        this.email = new FormControl('', [Validators.required]);
        this.insertForm = this.fb.group({
            'username': this.username,
            'password': this.password,
            'cpassword': this.cpassword,
            'email': this.email
        });
    }

    register() {
        const userRegister = this.insertForm.value;
        this.accountService.register(userRegister.username, userRegister.password, userRegister.email).subscribe(result => {
            this.router.navigateByUrl('/login');
        }, (error: any[]) => {
            console.log(error)
        });

    }

    get Username() {
        return this.username;
    }

    get Password() {
        return this.password;
    }

}
