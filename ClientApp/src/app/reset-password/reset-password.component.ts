import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldValidators } from '../register/username-validators';
import { CrossFieldValidators } from '../register/crossfield-validators';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {

    //#region Init
    form: FormGroup;
    email: string;
    token: string
    errorList: string[] = [];

    //#endregion Init

    constructor(private formBuilder: FormBuilder, private accountService: AccountService, private router: Router, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(p => {
            this.email = p['email']
            this.token = p['token']
        })
    }

    ngOnInit() {
        this.initForm()
    }

    initForm() {
        this.form = this.formBuilder.group({
            email: [this.email],
            token: [this.token],
            passwords: this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(128), FieldValidators.cannotContainSpace]],
                confirmPassword: ['', [Validators.required]],
            }, { validator: CrossFieldValidators.cannotBeDifferent })
        })
    }

    onSubmit() {
        const form = this.form.value;
        this.accountService.resetPassword(form.email, form.passwords.password, form.passwords.confirmPassword, form.token).subscribe(() => {
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

    get Passwords() {
        return this.form.get('passwords')
    }

    get Password() {
        return this.form.get('passwords.password')
    }

    get ConfirmPassword() {
        return this.form.get('passwords.confirmPassword')
    }

}
